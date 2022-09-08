from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from .serializers import StatementSerializer
from .models import Statement
from django.shortcuts import get_object_or_404

#CREATE
#POST: /statements/create/
@api_view(["POST"])
@parser_classes([JSONParser])
def create_statement(request):
    statement_serializer = StatementSerializer(data = request.data)

    if statement_serializer.is_valid():
        st = statement_serializer.save()
        st.save()

        return Response(StatementSerializer(st).data)

    return Response({
        'errors': file_form_serializer.errors
    })



#READ
#GET: /statements/get/<int:pk>
@api_view(["GET"])
def get_statement(request, pk):
    st = get_object_or_404(Statement, pk = pk)

    return Response(StatementSerializer(st).data)


#GET: /statements/get/list/?last_id=pk
@api_view(["GET"])
def get_new_statements(request):
    if 'last_id' not in request.GET:
        st_arr = Statement.objects.all().order_by('-id')[:10]
    else:
        pk = int(request.GET.get("last_id"))
        st_arr = Statement.objects.filter(pk__lt = pk).order_by('-id')[:10]
    
    st_ser_arr = [StatementSerializer(st).data for st in st_arr]

    return Response(st_ser_arr)


#Update
#PUT: /statements/save/
@api_view(["PUT"])
@parser_classes([JSONParser])
def update_statement(request):
    if 'id' not in request.data:
        return Response({
            'errors': ["id is not set"]
        })

    st_old = get_object_or_404(Statement, pk = int(request.data['id']))    
    
    st_ser = StatementSerializer(st_old, data = request.data)

    if st_ser.is_valid():
        st = st_ser.save()
        st.save()

        return Response(StatementSerializer(st).data)

    return Response({
        'errors': st_ser.errors
    })



#Delete
#DELETE: /statements/delete/<int:pk>
@api_view(["DELETE"])
def delete_statement(request, pk):
    st = get_object_or_404(Statement, pk = pk)
    st.delete()

    return Response(StatementSerializer(st).data)




