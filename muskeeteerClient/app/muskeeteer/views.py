from django.shortcuts import render, redirect
from django.http import *

def home(request):
	return redirect('storm_view')

def storm_view(request):
	render_data = {}
	render_data['storm'] = True
	return render(request,'home.html', render_data)

def tree_view(request):
	return render(request, 'tree.html')

# Create your views here.
