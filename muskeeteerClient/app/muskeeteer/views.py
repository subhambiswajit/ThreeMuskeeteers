from django.shortcuts import render, redirect
from django.http import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import os
import pdb

def login(request):
	return render(request, 'login.html')
def home(request):
	return redirect('storm_view')

def storm_view(request):
	render_data = {}
	render_data['storm'] = True
	# if request.GET['id'] != None:
	# 	print '>>>>>>>>>>>' + request.GET['id']
	return render(request,'home.html', render_data)

def tree_view(request):
	# if request.GET['id'] != None:
	# 	print '>>>>>>>>>>>' + request.GET['id']
	return render(request, 'tree.html')

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

@csrf_exempt
def deleteFile(request):
	pdb.set_trace()
	render_data = {}
	render_data['filePath'] = 'media/'+request.GET['db']+'/'+request.GET['id']+'/'+request.GET['filename']
	print render_data['filePath']
	if os.path.exists(render_data['filePath']):
		os.remove(render_data['filePath'])
	return HttpResponse("File Deleted") 
