// enchant.js本体やクラスをエクスポート
enchant();

var BACKGROUND_IMG = 'img/background4.png';
var BACKGROUND_LEFT_IMG = 'img/background_left.png';
var BACKGROUND_RIGHT_IMG = 'img/background_right.png';

var START_IMG = 'img/start.png';
var GAME_OVER_IMG = 'img/gameover.png';
var GAME_CLEAR_IMG = 'img/gameclear.png';

var BACKGROUND_TREES_IMG = 'img/background_trees.png';

var TREE1 = 'img/tree2_width65.png';
var TREE2 = 'img/tree_image.png';

var ROLLEDBOOK = 'img/rolled_book.png';
var KOBAN = 'img/koban.png';
var SMOKE1 = 'img/smoke1.png';
var SMOKE2 = 'img/smoke2.png';
var SUITO = 'img/suito_image.png';

var GROUND_ENEMY1 = 'img/ground_enemy1.png';
var GROUND_ENEMY2 = 'img/ground_enemy2.png';

// キャラクター画像用変数
var PLAYER_LIST = ['img/both_player.png', 'img/front_left_back_right_player.png', 'img/both_player.png', 'img/front_right_back_left_player.png'];

// ボタンイメージ
var LEFT_BUTTON = 'img/left_button.png';
var RIGHT_BUTTON = 'img/right_button.png';

// 森林画像の横幅
var TREE_WIDTH = 105;
// 森林画像の縦幅
var TREE_HEIGHT = 80;

// 一時的な音楽のため、変更する必要がある
// var BG_SOUND = "se/background_bgm.mp3";
var BG_BUTSUKARU = "se/butsukaru_oto.mp3";
var BG_KOBAN_SHUTOKU = "se/koban_shutoku_oto.mp3";
var BG_TOURINUKE = "se/tourinuke_oto.mp3";
var BG_ROLLEDBOOK_SHUTOKU = "se/rolled_book_shutoku_oto.mp3";
var BG_SKULL_OUT = "se/skull_out.mp3";
var BG_SKULL_OUT_TREE = "se/skull_out2.mp3";
var BG_GAME_CLEAR = "se/game_clear.mp3";

// ページが読み込まれたときに実行される関数
window.onload = function() {

	// ゲームオブジェクトの作成
	core = new Core(320, 320);

	// ゲーム初期化処理

	// fps(1秒間当たりの画面の描画回数)を設定する（省略時は「30」）
	/*
	core.fps = 10; // 簡単
	core.fps = 15; // 普通
	core.fps = 20; // ちょっと早い
	core.fps = 25; // 早い
	core.fps = 35; // 結構早い
	// あとは出現率(フレーム判定)を変更できるようにする

	*/
	// 木の生成タイミング
	var makeTree_fps = 20;
	
	core.fps = 15;

	// ゲームで使用する画像、音声ファイルを指定する
	core.preload(BACKGROUND_IMG, LEFT_BUTTON, RIGHT_BUTTON, BACKGROUND_TREES_IMG, ROLLEDBOOK, KOBAN, SMOKE1, SMOKE2, PLAYER_LIST[0], PLAYER_LIST[1], PLAYER_LIST[2], PLAYER_LIST[3], START_IMG
		, SUITO
		, GAME_OVER_IMG, GAME_CLEAR_IMG
		// , BG_SOUND
		, BACKGROUND_LEFT_IMG, BACKGROUND_RIGHT_IMG
		, TREE1, TREE2
		// , SKULL_ENEMY
		, GROUND_ENEMY1, GROUND_ENEMY2
		, BG_BUTSUKARU, BG_KOBAN_SHUTOKU, BG_TOURINUKE, BG_ROLLEDBOOK_SHUTOKU
		, BG_SKULL_OUT, BG_SKULL_OUT_TREE, BG_GAME_CLEAR);

	// 音
	// core.se1 = new Audio(BG_SOUND);
	// core.se1.value = 0;
	// core.se1.loop = true;

	// ぶつかる音
	core.se2 = new Audio(BG_BUTSUKARU);
	core.se2.value = 30;
	core.se2.loop = false;

	// 小判取得音
	core.se3 = new Audio(BG_KOBAN_SHUTOKU);
	core.se3.value = 30;
	core.se3.loop = false;
	
	// 通り抜け音
	core.se4 = new Audio(BG_TOURINUKE);
	core.se4.value = 30;
	core.se4.loop = false;

	// 通り抜け音
	core.se5 = new Audio(BG_ROLLEDBOOK_SHUTOKU);
	core.se5.value = 30;
	core.se5.loop = false;

	// 骨出現
	core.se6 = new Audio(BG_SKULL_OUT);
	core.se6.value = 5;
	core.se6.loop = false;

	// 髑髏出現
	core.se7 = new Audio(BG_SKULL_OUT_TREE);
	core.se7.value = 5;
	core.se7.loop = false;

	// ゲームクリア
	core.se8 = new Audio(BG_GAME_CLEAR);
	core.se8.value = 5;
	core.se8.loop = false;

	// ファイルのプリロードが完成した時に実行される関数
	core.onload = function() {
		// 背景設定
		var background = new Sprite(320, 320);
		background.image = core.assets[BACKGROUND_IMG];
		core.rootScene.addChild(background);

		core.pushScene(core.startScene());
	};

	/*
		ゲーム開始場面
	*/
	core.startScene = function() {

		// シーンの生成
		var scene = new Scene();

		// プレ背景の表示
		// var group_forest = new Group();
		// scene.addChild(group_forest);

		var group_forest_left = new Group();
		var group_forest_right = new Group();
		scene.addChild(group_forest_left);
		scene.addChild(group_forest_right);

		var bgForestLeft = new BgForestPre(-425, 35, BACKGROUND_LEFT_IMG);
		var bgForestRight = new BgForestPre(-255, 35, BACKGROUND_RIGHT_IMG);
		group_forest_left.insertBefore(bgForestLeft, group_forest_left.firstChild);
		group_forest_right.insertBefore(bgForestRight, group_forest_right.firstChild);

		var group_item = new Group();
		scene.addChild(group_item);
		
		// // プレ背景の動作
		// scene.onenterframe = function(){
		// 	if (core.frame % 20 == 0) {
		// 		// 左の開始配置(外野)
		// 		var left_forest = new BgForest(-90, 80, true);

		// 		// 右の開始配置(外野)
		// 		var right_forest = new BgForest(125, 80, false);
			
		// 		group_forest.insertBefore(left_forest, group_forest.firstChild);
		// 		group_forest.insertBefore(right_forest, group_forest.firstChild);
		// 	}
		// };

		// ゲーム開始メッセージ表示
		var gameStart = new Sprite(236, 48);
		gameStart.x = (320 - 236) / 2;
		gameStart.y = 50;
		gameStart.image = core.assets[START_IMG];
		scene.addChild(gameStart);

		/*

		// 難易度メッセージ
		var leval1Label = new Label("とてもゆっくりな速度でゲーム開始");
		// 経過時間ラベルを作成する
		leval1Label.x = (320 - 236) / 2 + 5;
		leval1Label.y = 150;
		// 文字色を設定する
		leval1Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval1Label.font = '14px sens-serif';
		scene.addChild(leval1Label);

		// 難易度メッセージ
		var leval2Label = new Label("ゆっくり速度でゲーム開始");
		// 経過時間ラベルを作成する
		leval2Label.x = (320 - 236) / 2 + 30;
		leval2Label.y = 170;
		// 文字色を設定する
		leval2Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval2Label.font = '14px sens-serif';
		scene.addChild(leval2Label);

		*/

		// 難易度メッセージ
		var leval3Label = new Label("タッチするとゲームが開始します");
		// 経過時間ラベルを作成する
		leval3Label.x = (320 - 236) / 2;
		leval3Label.y = 120;
		//leval3Label.y = 190;
		// 文字色を設定する
		leval3Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval3Label.font = '16px sens-serif';
		scene.addChild(leval3Label);

		/*

		// 難易度メッセージ
		var leval3Label = new Label("普通の速度でゲーム開始");
		// 経過時間ラベルを作成する
		leval3Label.x = (320 - 236) / 2 + 35;
		leval3Label.y = 190;
		// 文字色を設定する
		leval3Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval3Label.font = '14px sens-serif';
		scene.addChild(leval3Label);

		// 難易度メッセージ
		var leval4Label = new Label("速い速度でゲーム開始");
		// 経過時間ラベルを作成する
		leval4Label.x = (320 - 236) / 2 + 40;
		leval4Label.y = 210;
		// 文字色を設定する
		leval4Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval4Label.font = '14px sens-serif';
		scene.addChild(leval4Label);

		// 難易度メッセージ
		var leval5Label = new Label("かなり速い速度でゲーム開始");
		// 経過時間ラベルを作成する
		leval5Label.x = (320 - 236) / 2 + 20;
		leval5Label.y = 230;
		// 文字色を設定する
		leval5Label.color = '#FF00FF';
		// フォントサイズとフォントの種類を指定する
		leval5Label.font = '14px sens-serif';
		scene.addChild(leval5Label);

		*/

		// 難易度メッセージ
		var leval6Label = new Label("※音が出ますのでご注意ください");
		// 経過時間ラベルを作成する
		leval6Label.x = (320 - 236) / 2 + 40;
		leval6Label.y = 150;
		//leval6Label.y = 250;
		// 文字色を設定する
		leval6Label.color = '#FF0000';
		// フォントサイズとフォントの種類を指定する
		leval6Label.font = '10px sens-serif';
		scene.addChild(leval6Label);

		/*
		leval1Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 10;
			makeTree_fps = 30;

			scene.removeChild(this);
			scene.removeChild(leval2Label);
			scene.removeChild(leval3Label);
			scene.removeChild(leval4Label);
			scene.removeChild(leval5Label);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest.remove();
			group_item.remove();
			core.se1.currentTime = 0;
			core.se1.play();
			core.pushScene(core.runnerScene());
		});

		leval2Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 15;
			makeTree_fps = 25;

			scene.removeChild(leval1Label);
			scene.removeChild(this);
			scene.removeChild(leval3Label);
			scene.removeChild(leval4Label);
			scene.removeChild(leval5Label);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest.remove();
			group_item.remove();
			core.se1.currentTime = 0;
			core.se1.play();
			core.pushScene(core.runnerScene());
		});

		leval3Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 20;
			makeTree_fps = 20;

			scene.removeChild(leval1Label);
			scene.removeChild(leval2Label);
			scene.removeChild(this);
			scene.removeChild(leval4Label);
			scene.removeChild(leval5Label);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest.remove();
			group_item.remove();
			core.se1.currentTime = 0;
			core.se1.play();
			core.pushScene(core.runnerScene());
		});
		*/

		leval3Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 20;
			makeTree_fps = 20;

			scene.removeChild(this);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest_left.remove();
			group_forest_right.remove();
			group_item.remove();
			// core.se1.currentTime = 0;
			// core.se1.play();
			core.pushScene(core.runnerScene());
		});

		/*
		leval4Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 25;
			makeTree_fps = 15;

			scene.removeChild(leval1Label);
			scene.removeChild(leval2Label);
			scene.removeChild(leval3Label);
			scene.removeChild(this);
			scene.removeChild(leval5Label);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest.remove();
			group_item.remove();
			core.se1.currentTime = 0;
			core.se1.play();
			core.pushScene(core.runnerScene());
		});

		leval5Label.addEventListener(Event.TOUCH_END, function() {
			core.fps = 30;
			makeTree_fps = 10;

			scene.removeChild(leval1Label);
			scene.removeChild(leval2Label);
			scene.removeChild(leval3Label);
			scene.removeChild(leval4Label);
			scene.removeChild(this);
			scene.removeChild(leval6Label);
			gameStart.remove();
			group_forest.remove();
			group_item.remove();
			core.se1.currentTime = 0;
			core.se1.play();
			core.pushScene(core.runnerScene());
		});
		*/

		return scene;
	};

	/*
		ゲームの本筋場面
	*/
	core.runnerScene = function() {
		// シーンの生成
		var scene = new Scene();

		// 継続時間（秒）
		core.timeCount = 0;

		// 一時的な時間保存
		core.tmpTime = new Date().getTime();
		
		// 経過時間ラベル
		var timeLabel = new Label("走った時間:" + core.timeCount);
		// 経過時間ラベルを作成する
		timeLabel.x = 10;
		timeLabel.y = 10;
		// 文字色を設定する
		timeLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		timeLabel.font = '12px sens-serif';
		scene.addChild(timeLabel);

		// 背景設定
		var group_forest_left = new Group();
		var group_forest_right = new Group();
		scene.addChild(group_forest_left);
		scene.addChild(group_forest_right);

		var bgForestLeft = new BgForestLeftRight(-420, 35, BACKGROUND_LEFT_IMG, true);
		var bgForestRight = new BgForestLeftRight(-260, 35, BACKGROUND_RIGHT_IMG, false);
		group_forest_left.insertBefore(bgForestLeft, group_forest_left.firstChild);
		group_forest_right.insertBefore(bgForestRight, group_forest_right.firstChild);

		var group_forest = new Group();
		scene.addChild(group_forest);

		var group_item = new Group();
		scene.addChild(group_item);

		// 忍者インスタンスをグローバル定義
		var player = new Player(32, 32);
		// 忍者をシーンに追加
		scene.addChild(player);

		// 巻物ラベル
		var rolledLabel = new Label("忍術回数:" + player.rolledbook + "回");
		// 表示ラベルを作成する
		rolledLabel.x = 226;
		rolledLabel.y = 10;
		// 文字色を設定する
		rolledLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		rolledLabel.font = '12px sens-serif';
		scene.addChild(rolledLabel);

		// 巻物ラベル
		var kobanLabel = new Label("小判:" + player.koban + "枚");
		// 表示ラベルを作成する
		kobanLabel.x = 250;
		kobanLabel.y = 25;
		// 文字色を設定する
		kobanLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		kobanLabel.font = '12px sens-serif';
		scene.addChild(kobanLabel);
		
		// 左ボタン設定
		var leftBt = new ButtonClass(10, 320 - 60, core.assets[LEFT_BUTTON]);
		scene.addChild(leftBt);

		leftBt.addEventListener(Event.TOUCH_END, function() {
			if (player.x - 40 > 60) {
				player.x -= 40;
			}
		});
				
		// 右ボタン設定
		var rightBt = new ButtonClass(320 - 60, 320 - 60, core.assets[RIGHT_BUTTON]);
		scene.addChild(rightBt);
		rightBt.addEventListener(Event.TOUCH_END, function() {
			if (player.x + 40 < 230) {
				player.x += 40;
			}
		});

		//var testindex = 0;
		scene.onenterframe = function(){
			// 経過時間の計算
			var minitu = 0;
			var second = 0;
			var tmpSecond = Math.floor((new Date().getTime() - core.tmpTime) / 1000);
			
			if (tmpSecond >= 60) {
				minitu = Math.floor(tmpSecond / 60);
			}
			second = tmpSecond - minitu * 60;

			// 経過時間ラベル
			timeLabel.text = "経過時間: " + minitu + " 分 " + second + " 秒";

			if (tmpSecond >= 180) {
				// if (tmpSecond >= 300) {
				core.se8.currentTime = 0;
				core.se8.play();
				core.pushScene(core.gameClearScene());
			}

			// 左右の背景を表示
			if (tmpSecond == 120) {
				group_forest_left.insertBefore(new BgForestLeftRight(-420, 35, BACKGROUND_LEFT_IMG, true), group_forest_left.firstChild);
				group_forest_right.insertBefore(new BgForestLeftRight(-260, 35, BACKGROUND_RIGHT_IMG, false), group_forest_right.firstChild);
			}

			group_forest.insertBefore(new BgForest(Math.floor(Math.random() * 13), Math.floor(Math.random() * 13) % 2 == 0, bgForestLeft.y), group_forest.firstChild);
			// group_forest.insertBefore(new BgForest(12, true), group_forest.firstChild);
			group_forest.insertBefore(new BgForest(Math.floor(Math.random() * 13), Math.floor(Math.random() * 13) % 2 == 0, bgForestLeft.y), group_forest.firstChild);
			group_forest.insertBefore(new BgForest(Math.floor(Math.random() * 13), Math.floor(Math.random() * 13) % 2 == 0, bgForestLeft.y), group_forest.firstChild);
			group_forest.insertBefore(new BgForest(Math.floor(Math.random() * 13), Math.floor(Math.random() * 13) % 2 == 0, bgForestLeft.y), group_forest.firstChild);
			// var bgForestLeft = new BgForestLeftRight(-420, 35, BACKGROUND_LEFT_IMG, true);
			// var bgForestRight = new BgForestLeftRight(-260, 35, BACKGROUND_RIGHT_IMG, false);

			console.log("tmpSecond : " + tmpSecond);
			if (core.frame % 10 == 0 && tmpSecond < 10) {
				var create_item_number = Math.floor(Math.random() * Math.floor(20));
				var item_position = Math.floor(Math.random() * Math.floor(5));
				
				var main_item = null;
				if (create_item_number <= 3) {
					main_item = new Item(create_item_number, item_position);
				} else if (create_item_number <= 7) {
					main_item = new Tree(item_position);
				} else {
					main_item = new Skull(127, 50, item_position);
					main_item.imageNumber = 0;
				}
				
				main_item.addEventListener(Event.ENTER_FRAME, function() {
					if (create_item_number == 0) {
						if (this.y > 235 && this.y < 275){
							// 巻物と衝突判定
							if (player.x - 10 <= this.x && player.x + 20 >= this.x) {
								core.se5.currentTime = 0;
								core.se5.play();
								player.rolledbook += 1;
								rolledLabel.text = "忍術回数:" + player.rolledbook + "回";
								this.remove();
								//core.se5.pause();
							}
						}
					} else if (1 <= create_item_number && create_item_number <= 3) {
						if (this.y > 255 && this.y < 290){
							// 小判と衝突判定
							if (player.x - 10 <= this.x && player.x + 20 >= this.x) {
								core.se3.currentTime = 0;
								core.se3.play();
								player.koban += 1;
								kobanLabel.text = "小判:" + player.koban + "枚";
								this.remove();
							}
						}
					} else {
						if (this.y > 200 && this.imageNumber != 0 && this.imageNumber != 1 && this.imageNumber != 2){
							// 障害物(木)と衝突判定
							if (this.x < player.x && this.x + 30 > player.x) {
								if (player.rolledbook == 0) {
									core.se2.currentTime = 0;
									core.se2.play();
									core.pushScene(core.gameOverScene());
									group_forest.remove();
									group_item.remove();
									player.remove();
									leftBt.remove();
									rightBt.remove();
									// core.se1.pause();
									return;
								} else {
									scene.addChild(new SmokeClass(player.x - 20, player.y - 25));
									core.se4.currentTime = 0;
									core.se4.play();
									player.crashFlg = true;
									player.rolledbook -= 1;
									rolledLabel.text = "忍術回数:" + player.rolledbook + "回";
								}
							}
							this.remove();
						} else if (this.y > 150 && this.imageNumber != 0 && this.imageNumber != 1 && this.imageNumber != 2){
							this.image = core.assets[TREE2];
							core.se7.currentTime = 10;
							core.se7.play();
						} else if (create_item_number > 10){
							if (this.y > 270 && this.imageNumber == 2) {
								// 障害物(骨)と衝突判定
								if (this.x < player.x && this.x + 30 > player.x) {
									if (player.rolledbook == 0) {
										core.se2.currentTime = 0;
										core.se2.play();
										core.pushScene(core.gameOverScene());
										group_forest.remove();
										group_item.remove();
										player.remove();
										leftBt.remove();
										rightBt.remove();
										// core.se1.pause();
										return;
									} else {
										scene.addChild(new SmokeClass(player.x - 20, player.y - 25));
										core.se4.currentTime = 0;
										core.se4.play();
										player.crashFlg = true;
										player.rolledbook -= 1;
										rolledLabel.text = "忍術回数:" + player.rolledbook + "回";
									}
								}
								this.remove();
							} else if (this.y > 200 && this.imageNumber == 1){
								this.image = core.assets[GROUND_ENEMY2];
								this.imageNumber = 2;
								// core.se6.currentTime = 0;
								// core.se6.play();
								// scene.addChild(new SmokeClass2(this.x - 5, this.y + 5));
							} else if (this.y > 150 && this.imageNumber == 0){
								this.image = core.assets[GROUND_ENEMY1];
								core.se6.currentTime = 0;
								core.se6.play();
								this.imageNumber = 1;
								scene.addChild(new SmokeClass2(this.x - 5, this.y + 5));
							}
						}
					}
				});

				group_item.insertBefore(main_item, group_item.firstChild);
			}
		}

		return scene;
	};

	/*
		ゲーム終了場面
	*/
	core.gameOverScene = function() {

		// シーンの生成
		var scene = new Scene();

		// ゲーム終了メッセージ表示
		var gameOver = new Sprite(189, 97);
		gameOver.x = (320 - 189) / 2;
		gameOver.y = 10;

		gameOver.image = core.assets[GAME_OVER_IMG];
		gameOver.tl.moveTo(gameOver.x, (320 - 97) / 2 - 50, 5);
				
		gameOver.addEventListener(Event.TOUCH_END, function() {
			//core.popScene();
			location.reload();
		});

		scene.addChild(gameOver);

		return scene;
	};

	/*
		ゲームクリア場面
	*/
	core.gameClearScene = function() {

		// シーンの生成
		var scene = new Scene();

		// ゲーム終了メッセージ表示
		var gameClear = new Sprite(184, 122);
		gameClear.x = (320 - 180) / 2;
		gameClear.y = -120;

		gameClear.image = core.assets[GAME_CLEAR_IMG];
		gameClear.tl.moveTo(gameClear.x, 320 / 2 - 75, 50);
				
		gameClear.addEventListener(Event.TOUCH_END, function() {
			location.reload();
		});

		scene.addChild(gameClear);

		return scene;
	};

	// ゲームスタート
	core.start();
}

// プレイヤーの生成
var Player = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		enchant.Sprite.call(this, x, y);
		this.x = (320 - 32) / 2;
		this.y = 290;
		this.imgIndex = 0;
		this.scale(1.08, 1.1);
		this.image = core.assets[PLAYER_LIST[this.imgIndex]];
		this.koban = 0;
		this.rolledbook = 2;
		this.crashFlg = false;
		// this.life = 100;
		// this.lifeTime = Math.floor((new Date().getTime()) / 1000);
		

		this.addEventListener(Event.ENTER_FRAME, function() {
			if (this.crashFlg) {
				this.image = null;

				if (core.frame % 5 == 0){
					this.crashFlg = false;
				}
			} else {
				if (core.frame % 2 == 0){
					if (this.imgIndex < 3){
						this.imgIndex ++;
					} else {
						this.imgIndex = 0;
					}
	
					if (this.imgIndex % 2 == 0){
						this.y = 290;
					} else {
						this.y = 289;
					}
	
					this.image = core.assets[PLAYER_LIST[this.imgIndex]];
				}
			}
		});
	}
	// , clear: function() {

	// 	this.tl.scaleTo(0.001, 0.001, 50);
	// 	this.tl.and();
	// 	this.tl.moveTo(120, 50, 50);

	// 	this.addEventListener(Event.ENTER_FRAME, function() {
	// 		if (this.crashFlg) {
	// 			this.image = null;

	// 			if (core.frame % 5 == 0){
	// 				this.crashFlg = false;
	// 			}
	// 		} else {
	// 			if (core.frame % 2 == 0){
	// 				if (this.imgIndex < 3){
	// 					this.imgIndex ++;
	// 				} else {
	// 					this.imgIndex = 0;
	// 				}
	
	// 				if (this.imgIndex % 2 == 0){
	// 					this.y = 290;
	// 				} else {
	// 					this.y = 289;
	// 				}
	
	// 				this.image = core.assets[PLAYER_LIST[this.imgIndex]];
	// 			}
	// 		}
	// 	});

	// }
});

// // アイテム、障害物の生成
// var ItemOrTree = enchant.Class.create(enchant.Sprite, {
// 	initialize: function(item_number, position) {

// 		var scaleX_before = 0;
// 		var scaleY_before = 0;
// 		var scaleX_after = 0;
// 		var scaleY_after = 0;
// 		var moveSpeed = 0;
// 		var moveToX = 0;
// 		var moveToY = 0;

// 		if (0 == item_number) {
// 			// 画像サイズ調整
// 			enchant.Sprite.call(this, 40, 100);

// 			// 出現位置
// 			this.x = 140; // 画面サイズ(320) / 2 - 画像横サイズ(40) / 2
// 			this.y = 50;
// 			this.image = core.assets[ROLLEDBOOK];

// 			scaleX_before = 0.01;
// 			scaleY_before = 0.01;
// 			scaleX_after = 0.3;
// 			scaleY_after = 0.3;
// 			moveSpeed = 70;
// 			moveToY = 350;

// 			if (position == 0) {
// 				moveToX = this.x - 110;
// 			} else if (position == 1) {
// 				moveToX = this.x - 55;
// 			} else if (position == 2) {
// 				moveToX = this.x + 0;
// 			} else if (position == 3) {
// 				moveToX = this.x + 55;
// 			} else if (position == 4) {
// 				moveToX = this.x + 110;
// 			}

// 		} else if (1 <= item_number && item_number <= 3) {
// 			// 画像サイズ調整
// 			enchant.Sprite.call(this, 40, 55);

// 			// 出現位置
// 			this.x = 140; // 画面サイズ(320) / 2 - 画像横サイズ(40) / 2
// 			this.y = 75;
// 			this.image = core.assets[KOBAN];

// 			scaleX_before = 0.01;
// 			scaleY_before = 0.01;
// 			scaleX_after = 0.3;
// 			scaleY_after = 0.3;
// 			moveSpeed = 70;
// 			moveToY = 350;

// 			if (position == 0) {
// 				moveToX = this.x - 110;
// 			} else if (position == 1) {
// 				moveToX = this.x - 55;
// 			} else if (position == 2) {
// 				moveToX = this.x + 0;
// 			} else if (position == 3) {
// 				moveToX = this.x + 55;
// 			} else if (position == 4) {
// 				moveToX = this.x + 110;
// 			}
// 		} else {
// 			// 画像サイズ調整
// 			enchant.Sprite.call(this, 64, 126);

// 			// 出現位置
// 			this.x = 128;
// 			this.y = 40;
// 			this.image = core.assets[TREE];

// 			scaleX_before = 0.1;
// 			scaleY_before = 0.1;
// 			scaleX_after = 2.2;
// 			scaleY_after = 1.4;
// 			moveSpeed = 70;
// 			moveToY = 260;
	
// 			if (position == 0) {
// 				moveToX = this.x - 110;
// 			} else if (position == 1) {
// 				moveToX = this.x - 55;
// 			} else if (position == 2) {
// 				moveToX = this.x + 0;
// 			} else if (position == 3) {
// 				moveToX = this.x + 55;
// 			} else if (position == 4) {
// 				moveToX = this.x + 110;
// 			}
// 		} 

// 		this.scale(scaleX_before, scaleY_before);
// 		this.tl.scaleTo(scaleX_after, scaleY_after, moveSpeed);
// 		this.tl.and();
// 		this.tl.moveTo(moveToX, moveToY, moveSpeed);
// 	}
// });

// アイテム、障害物の生成
var Item = enchant.Class.create(enchant.Sprite, {
	initialize: function(item_number, position) {

		var scaleX_before = 0.01;
		var scaleY_before = 0.01;
		var scaleX_after = 0.3;
		var scaleY_after = 0.3;
		var moveSpeed = 70;
		var moveToX = 0;
		var moveToY = 350;

		if (0 == item_number) {
			// 画像サイズ調整
			enchant.Sprite.call(this, 40, 100);

			// 出現位置
			this.x = 140;
			this.y = 50;
			this.image = core.assets[ROLLEDBOOK];
			// this.image = core.assets[SUITO];

			scaleX_before = 0.01;
			scaleY_before = 0.01;
			scaleX_after = 0.3;
			scaleY_after = 0.3;
			moveSpeed = 70;
			moveToY = 350;

			if (position == 0) {
				moveToX = this.x - 110;
			} else if (position == 1) {
				moveToX = this.x - 55;
			} else if (position == 2) {
				moveToX = this.x + 0;
			} else if (position == 3) {
				moveToX = this.x + 55;
			} else if (position == 4) {
				moveToX = this.x + 110;
			}

		} else {
			// 画像サイズ調整
			enchant.Sprite.call(this, 40, 55);

			// 出現位置
			this.x = 140; // 画面サイズ(320) / 2 - 画像横サイズ(40) / 2
			this.y = 75;
			this.image = core.assets[KOBAN];

			if (position == 0) {
				moveToX = this.x - 110;
			} else if (position == 1) {
				moveToX = this.x - 55;
			} else if (position == 2) {
				moveToX = this.x + 0;
			} else if (position == 3) {
				moveToX = this.x + 55;
			} else if (position == 4) {
				moveToX = this.x + 110;
			}
		} 

		this.scale(scaleX_before, scaleY_before);
		this.tl.scaleTo(scaleX_after, scaleY_after, moveSpeed);
		this.tl.and();
		this.tl.moveTo(moveToX, moveToY, moveSpeed);
	}
});

// 障害物(木)の生成
var Tree = enchant.Class.create(enchant.Sprite, {
	initialize: function(position) {

		var scaleX_before = 0.1;
		var scaleY_before = 0.1;
		var scaleX_after = 2.2;
		var scaleY_after = 1.4;
		var moveSpeed = 70;
		var moveToX = 0;
		var moveToY = 260;

		// 画像サイズ調整
		enchant.Sprite.call(this, 64, 125);

		// 出現位置
		this.x = 128;
		this.y = 40;
		this.image = core.assets[TREE1];
	
		if (position == 0) {
			moveToX = this.x - 110;
		} else if (position == 1) {
			moveToX = this.x - 55;
		} else if (position == 2) {
			moveToX = this.x + 0;
		} else if (position == 3) {
			moveToX = this.x + 55;
		} else if (position == 4) {
			moveToX = this.x + 110;
		}

		this.scale(scaleX_before, scaleY_before);
		this.tl.scaleTo(scaleX_after, scaleY_after, moveSpeed);
		this.tl.and();
		this.tl.moveTo(moveToX, moveToY, moveSpeed);
	}
});

// 障害物(骨)の生成
var Skull = enchant.Class.create(enchant.Sprite, {
	initialize: function(startX, startY, positionNum) {

		var scaleX_before = 0.0001;
		var scaleY_before = 0.0001;
		var scaleX_after = 1.2;
		var scaleY_after = 1.2;
		var moveSpeed = 90;
		var moveToX = 0;
		var moveToY = 400;

		// 画像サイズ調整
		enchant.Sprite.call(this, 65, 75);

		// this.x = 125;
		this.x = startX;
		this.y = startY;

		// 出現位置
		if (positionNum == 0) {
			// 中央
			moveToX = 125;
		} else if (positionNum == 1) {
			// 左１
			moveToX = 55;
		} else if (positionNum == 2) {
			// 最左
			moveToX = 0;
		} else if (positionNum == 3) {
			// 右１
			moveToX = 185;
		} else if (positionNum == 4) {
			// 最右
			moveToX = 245;
		}

		this.scale(scaleX_before, scaleY_before);
		this.tl.scaleTo(scaleX_after, scaleY_after, moveSpeed);
		this.tl.and();
		// this.tl.moveTo(moveToX, moveToY, 100);
		this.tl.moveTo(moveToX, moveToY, moveSpeed);
	}
});

// // 左右の背景に当たる森林の生成
// var BgForest = enchant.Class.create(enchant.Sprite, {
// 	initialize: function(x, y, leftRightLFlg) {
// 		enchant.Sprite.call(this, 285, 120);
// 		this.image = core.assets[BACKGROUND_TREES_IMG];

// 		// 初期の縮小比率
// 		var scaleX = 0.5;
// 		var scaleY = 0.5;
// 		this.scale(scaleX, scaleY);
// 		this.x = x;
// 		this.y = y;

// 		this.tl.scaleTo(2.5, 80);
// 		this.tl.and();

// 		if (leftRightLFlg) {
// 			this.tl.moveTo(this.x - 300, 250, 50);
// 		} else {
// 			this.tl.moveTo(this.x + 300, 250, 50);
// 		}

// 		this.addEventListener(Event.ENTER_FRAME, function() {
// 			if (this.y > 200){
// 				this.remove();
// 			}
// 		});
// 	}
// });

// 木の生成
var BgForest = enchant.Class.create(enchant.Sprite, {
	initialize: function(position, leftRightLFlg, imgPositionY) {
		// サイズ設定
		enchant.Sprite.call(this, 64, 125);
		this.imgPositionY = imgPositionY;
		// this.image = core.assets[TREE1];

		// 初期の縮小比率
		this.scale(0.05, 0.05);
		this.y = 45;
		this.x = position * 10 - 10;
		var gotoPosition = (320 + (12 - position) * 10 + 64) * -1;

		if (leftRightLFlg) {
			this.x = 130 - this.x + 125;
			gotoPosition = gotoPosition * -1;
		}

		this.tl.moveTo(this.x + gotoPosition, 500, 100);
		this.tl.and();
		this.tl.scaleTo(1.1, 50);

		this.addEventListener(Event.ENTER_FRAME, function() {
			if (this.y > 200){
				this.remove();
			} else if (this.y >= this.imgPositionY) {
				this.image = core.assets[TREE1];
			}
		});
	}
});

// ボタン生成
var ButtonClass = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, positionImage) {
		enchant.Sprite.call(this, 50, 50);
		this.image = positionImage;
		this.x = x;
		this.y = y;
	}
});

// 衝突時の煙
var SmokeClass = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		// 画像の大きさ
		enchant.Sprite.call(this, 74, 72);
		this.image = core.assets[SMOKE1];

		// 表示位置
		this.x = x;
		this.y = y;

		// 画像切り替え番号
		// this.imageNumber = 0;

		this.addEventListener(Event.ENTER_FRAME, function() {
			if (core.frame % 2 == 0){
				this.remove();
			}
			/*
			if (this.imageNumber == 1) {
				this.image = core.assets[SMOKE2];
			} else if (this.imageNumber == 2) {
				this.remove();
			}

			this.imageNumber++;
			*/
		});
	}
});

// 衝突時の煙
var SmokeClass2 = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		// 画像の大きさ
		enchant.Sprite.call(this, 74, 72);
		this.image = core.assets[SMOKE1];

		// 表示位置
		this.x = x;
		this.y = y;
		this.scale(0.5, 0.5);

		// 画像切り替え番号
		this.tl.moveTo(x, y + 10, 100);

		this.addEventListener(Event.ENTER_FRAME, function() {
			if (core.frame % 5 == 0){
				this.remove();
			}
		});
	}
});

// 左右の林の背景
var BgForestLeftRight = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, imagePath, leftRightLFlg) {
		// 画像の大きさ
		enchant.Sprite.call(this, 1000, 120);
		this.image = core.assets[imagePath];

		// 表示位置
		this.x = x;
		// this.x = -420;
		this.y = y;
		this.scale(0.15, 0.15);

		var moveToX = 535;
		var moveToY = y + 50;
		// var moveSpeed = 5000;
		var moveSpeed = 4000;

		if (leftRightLFlg) {
			moveToX = x + (moveToX * -1);
		} else {
			moveToX = x + (moveToX * 1);
		}

		// this.scale(scaleX_before, scaleY_before);
		this.tl.scaleTo(1.2, 1.2, moveSpeed);
		this.tl.and();
		// this.tl.moveTo(moveToX, y + 50, 5000);
		this.tl.moveTo(moveToX, moveToY, moveSpeed);
	}
});

// 左右の林の背景
var BgForestPre = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, imagePath) {
		// 画像の大きさ
		enchant.Sprite.call(this, 1000, 120);
		this.image = core.assets[imagePath];

		// 表示位置
		this.x = x;
		this.y = y;
		this.scale(0.16, 0.16);
	}
});
