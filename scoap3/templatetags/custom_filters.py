from django import template

register = template.Library()


@register.filter
def replace_substring(value, arg):
    """Replaces a substring in a string with another."""
    original_string, new_string = arg.split(",")
    return value.replace(original_string, new_string)
