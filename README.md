<aside>
✏️ **기획서 템플릿**

- 서비스 명 : 감정 다이어리 (가제)
    1. 프로젝트 주제 
        
        : 텍스트에서 감정을 분석하고, 
        
          결과 데이터를 활용하여 시각화 및 유사도 분석을 할 수 있다. 
        
    2. 유저에게 보이는 웹 서비스 타이틀 및 한 줄 소개
        
        “텍스트에도 표정이 있다!”
        
        - (캐치프레이즈 후보)
            
            “현재 당신의 글은 어떤 표정을 하고 있나요?”
            
            “현재 당신의 감정은 어떤 색 인가요?”
            
    3. 팀 구성원의 전체 이름과 역할 
        
        현지예 : Front End, AI
        전보경 : Front End, AI
        김예린 : Front End, AI
        최규진 : Front End
        남현정 : Back End, AI
        임효근 : Back End
        
        
- 서비스 설명
    1. 기획 의도 
        - 조사할 문제, 조사할 문제가 흥미로운 이유
            - 언어적인 정보만 있는 텍스트에서 감정을 분석할 수 있는가.
            - 텍스트 분석을 통해 감정의 유사도를 파악할 수 있는가.
        - 어떤 사용자의, 어떤 문제를 해결하는지
            - ‘감정’을 기록하고 정리하고 싶은 사용자
            - 비슷한 ‘고민’을 다른 사람들과 공유하고 싶은 사용자
        - 프로젝트가 제공하는 기대 효과와 활용 방안
            - 
        - 고려할 사항
            - 프라이버시
            
    2. 사용된 데이터 셋과 기술 스택
        - 어떤 데이터 셋을 어떻게 전처리하고 사용할 것인지
            - ****감성 대화 말뭉치****
                
                [AI-Hub](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=86)
                
                [06. [자연어영역] 감성 대화 말뭉치.pdf](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/680f504c-4764-4355-8bf6-4c1eee43b6e5/06._%E1%84%8C%E1%85%A1%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%A5%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%8B%E1%85%A7%E1%86%A8_%E1%84%80%E1%85%A1%E1%86%B7%E1%84%89%E1%85%A5%E1%86%BC_%E1%84%83%E1%85%A2%E1%84%92%E1%85%AA_%E1%84%86%E1%85%A1%E1%86%AF%E1%84%86%E1%85%AE%E1%86%BC%E1%84%8E%E1%85%B5_(2).pdf)
                
        - 어떤 방법, 라이브러리나 알고리즘을 사용할 것인지
            - BERT 모델 : Aspect Category Detection + Aspect Sentiment Classification
            - SKT Brain KoBERT Model
            - korBERT : Review에서 주요 단어를 추출하기 가장 좋은 tokenizer
                
                [[Research] Review에서 주요 단어를 추출하기 가장 좋은 tokenizer는 무엇일까](https://velog.io/@jonas-jun/ae-tokenizer)
                
            - koBERT 모델
                
                [[Deep Learning] KoBERT 모델에 대해](https://velog.io/@dev-junku/KoBERT-%EB%AA%A8%EB%8D%B8%EC%97%90-%EB%8C%80%ED%95%B4)
                
            - koBERT로 다중 분류 모델 만들기 _ 코드
                
                [[파이썬]KoBERT로 다중 분류 모델 만들기 - 코드](https://velog.io/@seolini43/KOBERT%EB%A1%9C-%EB%8B%A4%EC%A4%91-%EB%B6%84%EB%A5%98-%EB%AA%A8%EB%8D%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%ED%8C%8C%EC%9D%B4%EC%8D%ACColab)
                
        - 이 프로젝트의 맥락과 배경이 유사한 인공지능 기반 서비스의 활용 사례 및 참고 논문
            - 딥러닝 기반의 다범주 감성분석 모델 개발
                
                [](https://koreascience.kr/article/JAKO201712965731628.pdf)
                
            - 딥러닝을 활용한 감정 분석 과정에서 필요한 데이터 전처리 및 형태 변형
                
                [](https://cdn-api.elice.io/api/file/0aa10892ac7e4e238f85cfbfb6e316d3/%EA%B0%90%EC%A0%95%EB%B6%84%EC%84%9D%20%EC%A0%84%EC%B2%98%EB%A6%AC.pdf?se=2022-11-20T00%3A15%3A00Z&sp=rt&sv=2020-10-02&sr=b&sig=7Bx0wFQsJVTFDJDog2mHYyZkLVKg5gbVgBuRTT34pOY%3D)
                
            - BERT를 활용한 속성기반 감성분석
                
                [원문보기 - ScienceON](https://scienceon.kisti.re.kr/commons/util/originalView.do?cn=JAKO202009135419336&oCn=JAKO202009135419336&dbt=JAKO&journal=NJOU00400536)
                
        
    3. 웹 서비스의 최종적인 메인 기능과 서브 기능 설명
        1. 메인 기능 (페이지)
            - 회원가입 & 로그인
            - 글작성 > 작성, 수정, 삭제
            
                   글작성 > 감정 분석 (> 유사한 글 추천)
            
            - 분석된 감정 데이터 시각화
            - 친구 / 유사 감정 사용자와 채팅
        2. 서브 기능
            - 친구 추가 > 공개 범위 설정
            - 마이페이지 > 소개, 회원정보 수정
        3. 언급된 기능
            - 소셜 회원가입 & 로그인 (카카오)
            - 아이디/비밀번호 찾기
            - 단어 클러스터
            - 감정 분석 결과를 피드 색상으로 표현
            - 감정 분석 결과를 이모지로 표현
            - 리프레시 토큰
            - 이메일 인증
            - 감정 분석 결과에 맞는 음악 추천
        
    4. 프로젝트 구성
        - 페이지 구성 (스토리보드 및 유저 시나리오)
        - 와이어프레임
        
    5. 예시 사이트
        - 피드
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5d9e6147-0f99-46ae-a83d-d19506e963ac/Untitled.png)
            
        - 기분 추이 그래프
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/89d19e73-fc78-4899-8696-dbb068bd8b9a/Untitled.png)
            
        - 감정 기록 포스터 판매 사이트
</aside>