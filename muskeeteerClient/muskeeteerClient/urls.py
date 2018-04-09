from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'muskeeteerClient.views.home', name='home'),
    url(r'^', include('app.muskeeteer.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
