(function() {

	var MACHINE_EMUL_ID = parseInt(Math.random() * 0xFFFFFF, 10);
	var PROCESS_EMUL_ID = Math.floor(Math.random() * 100000) % 0xFFFF;
	var ID_INDEX = parseInt(Math.random() * 0xFFFFFF, 10);

	function changeNumberToHexString(number, length) {
		number = number.toString(16);
		return number.length === length ? number : '00000000'.substring(number.length, length) + number;
	}

	function generateId() {
		var now = parseInt(new Date().getTime() / 1000, 10) % 0xFFFFFFFF;
		var id = changeNumberToHexString(now, 8) + changeNumberToHexString(MACHINE_EMUL_ID, 6) + changeNumberToHexString(PROCESS_EMUL_ID, 4) + changeNumberToHexString(ID_INDEX, 6);
		ID_INDEX = (ID_INDEX + 1) % 0xFFFFFF;
		return id;
	}

	function extend(origin, extend) {

		var name;
		
		for (name in extend) {
			if (extend.hasOwnProperty(name) === true) {
				if (extend[name] === undefined) {
					delete origin[data];
				} else {
					origin[name] = extend[name];
				}
			}
		}

		return origin;
	}

	// 이지-맨 캬
	window.FirebaseEasyMan = function(firebaseURL) {

		var firebase = new Firebase(firebaseURL);

		var authedUserData = undefined;

		// 가입
		function join(email, password, callback) {

			firebase.createUser({
				email : email,
				password : password
			}, function(err, userData) {
				if (userData !== undefined) {
					userData.email = email;
				}
				callback(err, userData);
			});
		}

		// 로그인
		function login(email, password, callback) {

			authedUserData = {
				email : email,
				password : password
			};

			firebase.authWithPassword({
				email : email,
				password : password
			}, function(err, authData) {
				if (authData !== undefined) {
					authData.email = email;
				}
				callback(err, authData);
			});
		}

		function updateEmail(newEmail, callback) {
			//TODO:
			firebase.changeEmail({
				oldEmail : authedUserData.email,
				newEmail : newEmail,
				password : authedUserData.password
			}, function(error) {
				if (error) {
					switch (error.code) {
					case "INVALID_PASSWORD":
						console.log("The specified user account password is incorrect.");
						break;
					case "INVALID_USER":
						console.log("The specified user account does not exist.");
						break;
					default:
						console.log("Error creating user:", error);
					}
				} else {
					console.log("User email changed successfully!");
				}
			});
		}

		function updatePassword(newPassword, callback) {
		}

		// 로그아웃
		function logout() {

			firebase.unauth();
		}

		// 최초 저장 및 수정
		function save(collectionName, data, callback) {

			var id;

			// 저장
			if (data.id === undefined) {
				id = generateId();

				firebase.child(collectionName).child(id).set(data, function(err) {
					if (err !== null) {
						callback(err);
					} else {
						data.id = id;
						callback(err, data);
					}
				});
			}

			// 수정
			else {
				id = data.id;
				delete data.id;

				get(collectionName, id, function(err, savedData) {
					if (err !== null) {
						callback(err);
					} else {
						firebase.child(collectionName).child(id).set(extend(savedData, data), function(err) {
							if (err !== null) {
								callback(err);
							} else {
								data.id = id;
								callback(err, data);
							}
						});
					}
				});
			}
		}

		// 저장된 데이터 가져와
		function get(collectionName, id, callback) {

			firebase.child(collectionName).child(id).once('value', function(snapshot) {
				var data = snapshot.val();
				data.id = id;
				callback(null, data);
			}, function(err) {
				callback(err);
			});
		}

		// 찾아라
		function find(collectionName, key, start, end, count, callback) {

			firebase.child(collectionName).orderByChild(key).startAt(start).endAt(end).limitToFirst(count).once('value', function(snapshot) {
				var dataSet = snapshot.val();
				var ret = [];
				if (dataSet === null) {
					callback(null, ret);
				} else {
					var id;
					var data;
					
					for (id in dataSet) {
						if (dataSet.hasOwnProperty(id) === true) {
							data = dataSet[id];
							data.id = id;
							ret.push(data);
						}
					}
					callback(null, ret);
				}
			}, function(err) {
				callback(err);
			});
		}

		return {

			join : join,
			login : login,
			updateEmail : updateEmail,
			updatePassword : updatePassword,
			logout : logout,

			save : save,
			get : get,
			find : find
		};
	};
})();
