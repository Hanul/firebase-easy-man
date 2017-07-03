*이 프로젝트는 [Firecase](https://github.com/Hanul/Firecase) 프로젝트에 통합되었습니다.*

# firebase-easy-man
oh yeah~

Firebase를 쉽게 쓰자요.

## 연결
```javascript
var fem = FirebaseEasyMan('https://<YOUR-FIREBASE-APP>.firebaseio.com/');
```

## 계정 관련 기능들
### 가입
```javascript
fem.join('your@email.com', 'password', function(err, userData) {
	...
});
```
#### err.code 값 종류들
* `EMAIL_TAKEN` 이미 이메일이 존재함
* `INVALID_EMAIL` 이메일이 잘못됨

### 로그인
```javascript
fem.login('your@email.com', 'password', function(err, userData) {
	...
});
```
#### err.code 값 종류들
* `INVALID_PASSWORD` 비밀번호가 잘못됨

## 데이터 관련 기능들
`save(collectionName, data, callback)`
### 값 저장
```javascript
fem.save('sample', {
	test : 123
}, function(err, savedData) {
	...
});
```
#### err.code 값 종류들
* `PERMISSION_DENIED` 로그인 되지 않음

### 값 가져오기
`get(collectionName, id, callback)`
```javascript
fem.get('sample', id, function(err, savedData) {
	...
});
```
#### err.code 값 종류들
* `PERMISSION_DENIED` 로그인 되지 않음

### 값 여러개 가져오기
`find(collectionName, key, start, end, count, callback)`
```javascript
fem.find('sample', 'test', 123, 123, 3, function(err, savedData) {
	...
});
```
#### err.code 값 종류들
* `PERMISSION_DENIED` 로그인 되지 않음

![ScreenShot](https://raw.githubusercontent.com/Hanul/firebase-easy-man/master/usethis.png)

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)
