from ast import List
from concurrent.futures.process import _ResultItem
import imp
import json
import string
from tkinter import Listbox
import uvicorn
from typing import Optional, List
from unittest import result
from fastapi.encoders import jsonable_encoder

from typing import Optional, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from urllib.parse import urlencode
import models
from pydantic import BaseModel

# uvicorn main:app --reload
# https://hashdork.com/ko/how-to-build-and-deploy-a-machine-learning-model-with-fastapi/

app = FastAPI()


# 일단 데이터 단순화 하고 /리스트스트링으로 테스트 => 폴리싱/ data........

class latestContent(BaseModel):
    content: str


class dataType(BaseModel):
    input: str
    vector: List[str] = []


class data(BaseModel):
    name: str
    job: str


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    data = {"hello": "World 파이썬 시작"}
    return data


@app.post("/sentenceSimilarity")
def sentenceSimilarity(req: dataType):
    # print("data==이러면 오나??", req)
    result = models.model.sentenceSimilarity(req)
    print(result)
    return result


@app.patch("/sentenceSimilarity")
def sentenceSimilarityUpdate(req: latestContent):
    print("문장유사도 patch main")
    result = models.model.sentenceSimilarityUpdate(req)
    print(result)
    return result
    # return "??"


@app.post("/emotionAnalysis")
def emotionAnalysis(req: latestContent):
    print("감정추출 main", req)
    result = models.model.emotionAnalysis(req)
    print(result)
    return result
