from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

def user_is_authenticated(function):
    def wrap(request, *args, **kwargs):
        if 'email' in  request.session:
            return function(request, *args, **kwargs)
        else:
            return HttpResponseRedirect(reverse('landing'))
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap