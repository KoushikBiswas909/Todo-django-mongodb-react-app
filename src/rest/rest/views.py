from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import logging
import os
from pymongo import MongoClient
import pprint
from bson.objectid import ObjectId

from bson.json_util import dumps


mongo_uri = 'mongodb://localhost:27017'
db = MongoClient(mongo_uri)['demo']


def convertTodoToDict(todo):
    if 'title' in todo.keys():
        return {'id': str(todo['_id']), 'title': todo['title']}
    else:
        return None


class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        # print(db.list_collection_names())
        todosCollection = db.todos
        todos = (list(todosCollection.find({})))
        todos = list(map(convertTodoToDict, todos))
        todos = list(filter(lambda x: x is not None, todos))
        return Response(todos, status=status.HTTP_200_OK)

    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        todos = db.todos
        id = todos.insert_one(request.data).inserted_id
        todo = todos.find_one({"_id": ObjectId(id)})
        createdTodo = {"id": str(todo["_id"]), "title": todo["title"]}
        return Response(createdTodo, status=status.HTTP_200_OK)
