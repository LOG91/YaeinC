# :blue_book: 예인교회 출석부

### 예인 출석부 Project

교회의 불편한 출석 체크 시스템을 개선하기 위한 목적으로 제작되었습니다

출석부를 넘어서서 멤버의 Data를 사용하여

장기 결석자를 파악하고, 기도제목을 공유하여 교회를 더 아름다운 곳으로

만드는 목적을 갖고 있습니다
### 🕹 Getting Started

- 서비스 페이지 (https 준비중)
www.yaein.org:8080

- 어드민 페이지 (현재 로그인 없음)
www.yaein.org:8080/admin


### 🥅 앱의 목표
- 대상은 청년부터 장년에 이르는 인원이기 때문에 모든 연령이 쉽게 사용할 수 있어야 한다
- 구글 스프레드시트보다 메리트가 없다면 본 앱의 생존 의미가 사라진다
- 관리자에게 Data의 Visualization이 있어야 한다


### ⚔️ 기술 스택
- Javascript (React with redux)
- HTML, CSS
- Express
- MongoDB
- AWS EC2
- Webpack

### 개발자의 목표 (TMI)
이 Project를 하게 된 이유는 크게 두 가지가 있다
##### 1. 서비스 제공
어릴적부터(물론 지금도) 서비스를 만들어서 사람들에게 제공하고 싶었었다

뛰어난 개발자가 된 후에 서비스를 만들 생각은 늘 품고 있다

교회의 출석부가 불편하다는 사실을 알게 되었고, 그것은 지금 내가 개발하기에 딱이었다
##### 2. 풀스택의 경험
개발의 실력을 올리기엔 개인 프로젝트, 그것도 배포할 수 잇는 프로젝트가 필요함을 느꼈다

그리고 나의 습득 스타일은 역시 "직접 만들면서" 라는 것을 알기에 우선 무작정 만들기로 했다

그리고 앱을 만들면서 확신했다 만들고 필요한 것을 배우는 것이 나에게 맞다는 것을!

### 💫 프로젝트 회고
##### 1. Very Good Experience :)
개발 역량을 늘리기에 아주 적합한 프로젝트였다

페이지의 UI는 사실상 별 것 없다..... 하지만 CRUD가 아주 적절히 포함되어 있다

api를 직접 설계하면서 데이터의 플로우를 경험하는 **진귀한** 경험도 하게 되었다

Server와 DB, AWS도 함께 하기 때문에 웹을 전반적으로 이해하는 시간이 되었다
##### 2. 습득 방법의 발견
완벽히 공부하고 시작하는 우리나라 공부법에 나도 갇혀 있었고, 나는 더욱 심했다

하지만 이 프로젝트를 하면서 그 틀을 부숴버리게 되었다

우선 구글링하며 만든다 물론 그 이후에는 물론 문제가 발생한다 (성능, 유지보수 힘듦, 이해 못하는 코드...)

그리고 공부를 병행한다 필자의 경우엔 javascript.info 사이트와 ZeroCho님의 zeroChoTV 였다

이 방법을 쓰면 구현 위주였던 내 코드를 분석하게 되고, 이해하게 되고 함성을 지르게 된다;;;;

그러면서 코드가 다듬어지고 내 것이 되는 것을 느꼈다!

내 생각에 좋은 비율은 `개발8:공부2` 혹은 `개발7:공부3` 정도인 것 같다
##### 3. 트러블 슈팅에 맞서다
트러블이 늘 두려웠었다 피하기만 했었고 차라리 다른 로직을 짜거나, 라이브러리를 쓰곤 했었다

하지만 이 프로젝트를 하며, 실무에선 어차피 도망 못간다는 사실을 깨닫게 되었고,

부딪치는 방법을 배웠다 서버쪽, 디비쪽 문제들이 많이 생겼지만 나도 충분히 할 수 있다고 생각하고

부딪치니 다 해결할 수 있는 문제들이었다 내 개발 인생에 중요한 포인트가 될 것 같다
##### 4. 서비스이기때문에 배운 것
아직 배포 전이지만 (배포 임박) 실제 서비스할 것이기 때문에 사용자의 입장을 고려하게 되었고

그렇기 때문에 그나마 실제 서비스답게 만들기 위해 힘쓰게 되었다

그동안 어떻게 동작하든지 별 상관 없던 개인 프로젝트와는 다른 경험이었다

