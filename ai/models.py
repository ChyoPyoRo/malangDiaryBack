from pydantic import BaseModel
# import sentence_transformers
import numpy as np
import pandas as pd
from numpy import dot
from numpy.linalg import norm
import urllib.request
from typing import Optional, List

import re
import pickle
from keras.models import load_model
from konlpy.tag import Okt


class latestContent(BaseModel):
    content: str


class dataType(BaseModel):
    input: str
    vector: List[str] = []


class model:

    # def sentenceSimilarity(data: dataType):
    #     print(data)
    #     model = SentenceTransformer(
    #         'sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens')
    #     rawData = data.input
    #     currentContent = model.encode(rawData)
    #     compareContentString = data.vector
    #     simList = []
    #     # print("🔥🔥1")

    #     def tofloat(data):
    #         data = data.replace("[", "").replace(
    #             "]", "").replace("\n", "").split(" ")
    #         data = [float(i) for i in data if i != '']
    #         return data

    #     for vec in compareContentString:
    #         result = np.array(tofloat(vec))
    #         simList.append(result)

    #     def cos_sim(a, b):
    #         return dot(a, b)/(norm(a)*norm(b))

    #     simDic = {}
    #     for i in range(len(simList)-3):
    #         result = cos_sim(currentContent, simList[i])
    #         simDic[i] = result
    #     # print("🔥🔥2")

    #     sortedDic = sorted(
    #         simDic.items(), key=lambda item: item[1], reverse=True)

    #     resultList = []
    #     for i in range(3):
    #         resultList.append(sortedDic[i][0])
    #     print("🔥🔥3")
    #     print("sim dic 형태확인용 ", resultList)

    #     currentContentVec = np.array2string(currentContent)
    #     returnValue = {"result":resultList, "vector":currentContentVec}
    #     # returnValue = {"result":"임시", "vector":currentContentVec}
    #     return returnValue

    # def sentenceSimilarityUpdate(data: latestContent):
    #     model = SentenceTransformer(
    #         'sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens')
    #     rawData = data.content
    #     currentContent = model.encode(rawData)

    #     currentContentVec = np.array2string(currentContent)
    #     # returnValue = {"vector":currentContentVec}
    #     return currentContentVec

    def emotionAnalysis(content: str):
        print('test1', content)
        print(type(content))
        model = load_model('2results_230328.h5')

        def text_cleaning(content):
            text = content

            okt = Okt()
            words = okt.pos(text, stem=True)
            words_avn = [word[0] for word in words if word[1] ==
                         'Adjective' or word[1] == 'Verb' or word[1] == 'Noun']

            return words_avn

        with open('./tokenizer_230328.pkl', 'rb') as tk:
            tokenizer = pickle.load(tk)

        X = tokenizer.texts_to_sequences(text_cleaning(content))

        prediction = np.array(model.predict(X))
        result = prediction.sum(axis=0)

        idx = np.argmax(result)
        emotion_dict = {0: '긍정', 1: '부정'}

        return emotion_dict[idx]
