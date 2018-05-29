from django.shortcuts import render, redirect
from django.http import *
from django.views.decorators.csrf import csrf_exempt
from app.muskeeteer.decorators import user_is_authenticated
from django.http import HttpResponse
import os
import pdb
import requests

def landing(request):
	request.session.flush()
	return render(request, 'login.html')

@csrf_exempt
def login(request):
	print 'working'
	request.session['email'] = request.POST['email']
	request.session['password'] = request.POST['password']
	request.session['isAdmin'] = request.POST['isAdmin']
	print request.session['email']
	# print request.POST['password']
	# print request.POST['email']
	# response = requests.get('http://localhost:3000/api/6666', params= request.POST)
	# print response.status_code
	# print response
	return HttpResponse("true")

def getSession(request):
	session_details = {}
	if 'email' in request.session:
		session_details.email = request.session.get['email']
	if 'isAdmin' in request.session:
		session_details.isAdmin = request.session.get['isAdmin']

	return HttpResponse(session_details)

@user_is_authenticated
def home(request):
	return redirect('storm_view')

@user_is_authenticated
def storm_view(request):
	render_data = {}
	render_data['storm'] = True
	# if request.GET['id'] != None:
	# 	print '>>>>>>>>>>>' + request.GET['id']
	print request.session['email']
	return render(request,'home.html', render_data)

@user_is_authenticated
def tree_view(request):
	# if request.GET['id'] != None:
	# 	print '>>>>>>>>>>>' + request.GET['id']
	return render(request, 'tree.html')

@user_is_authenticated
def automationtree_view(request):
	return render(request, 'automationtree.html')
# Create your views here.


@csrf_exempt
def fileuploader(request):
	render_data = {}
	print request.FILES.get('fileContainer')
	if 'fileContainer' in request.FILES:
		# pdb.set_trace()
		print request.POST['id']
		print request.POST['db']
		data = request.FILES.get('fileContainer').read()
		render_data['fileContainer'] = 'media/'+request.POST['db']+'/'+request.POST['id']+'/'+str(request.FILES.get('fileContainer'))
		# pdb.set_trace()
		if os.path.exists('media/'+request.POST['db']+'/'+request.POST['id']):
			with open(render_data['fileContainer'], 'wb+') as f:
				f.write(data)
		else:
			os.makedirs('media/'+request.POST['db']+'/'+request.POST['id'])
			print '>>>>>>>>>>>'
			with open(render_data['fileContainer'], 'wb+') as f:
				f.write(data)
	return HttpResponse(request.FILES.get('fileContainer')) 

@user_is_authenticated
@csrf_exempt
def deleteFile(request):
	pdb.set_trace()
	render_data = {}
	render_data['filePath'] = 'media/'+request.GET['db']+'/'+request.GET['id']+'/'+request.GET['filename']
	print render_data['filePath']
	if os.path.exists(render_data['filePath']):
		os.remove(render_data['filePath'])
	return HttpResponse("File Deleted") 
