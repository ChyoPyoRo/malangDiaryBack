from pydantic import BaseModel
import numpy as np
import pandas as pd
from numpy import dot
from numpy.linalg import norm
import urllib.request
# from sentence_transformers import SentenceTransformer
from typing import Optional, List
###
import re
import pickle
from keras.models import load_model
from konlpy.tag import Okt
# from keras.preprocessing.text import Tokenizer


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

    def emotionAnalysis(content: latestContent):
        print("model!!!",content)
        model = load_model('team10_roberta_word_1212.h5')
        print("model 못 불러오는거 같은데?",model)

        def text_cleaning(content):
            text = content.content
            print("model textcleaning","👾")

            okt = Okt()
            words = okt.pos(text, stem=True)
            print("model textcleaning","👾👾")
            words_avn = [word[0] for word in words if word[1] ==
                         'Adjective' or word[1] == 'Verb' or word[1] == 'Noun']

            print("model words_avn","👾👾👾")
            return words_avn

        with open('./tokenizer_1212.pkl', 'rb') as tk:
            print("tokenizer","👾👾👾👾")
            tokenizer = pickle.load(tk)

        word_index = tokenizer.word_index

        X = tokenizer.texts_to_sequences(text_cleaning(content))

        print("tokenizer","🐥")
        prediction = np.array(model.predict(X))
        result = prediction.sum(axis=0)

        idx = np.argmax(result)
        print("idx","🐥", idx)
        emotion_dict = {0: '감사한', 1: '신이 난', 2: '자신감',
                        3: '편안한', 4: '분노', 5: '불안', 6: '상처', 7: '슬픔'}
        print("model 여기 안오나?")

        return emotion_dict[idx]

# print(sentenceSimilarity("배고프고 졸려"))
