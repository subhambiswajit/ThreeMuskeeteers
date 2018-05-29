from django.conf.urls import patterns, include, url
from app.muskeeteer import views

urlpatterns = patterns('',
    # Examples:
    url(r'^$', views.home, name='home'),
    url(r'^storm$', views.storm_view, name='storm_view'),
    url(r'^tree$', views.tree_view, name='tree_view'),
    url(r'^automationtree$', views.automationtree_view, name='tree_view'),
    url(r'^fileUploader$', views.fileuploader, name='file_upload'),
    url(r'^fileDelete$', views.deleteFile, name='file_delete'),
    url(r'^landing$', views.landing, name='landing'),
    url(r'^login$', views.login, name='login'),
    url(r'^getSession$', views.getSession, name='getSession'),
    # url(r'^blog/', include('blog.urls')),
)