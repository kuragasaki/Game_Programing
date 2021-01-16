// enchant.js本体やクラスをエクスポート
enchant();

var BACKGROUND_IMG = 'img/background.png';
var START_IMG = 'img/start.png';
var GAME_OVER_IMG = 'img/gameover.png';

var BACKGROUND_TREES_IMG = 'img/background_trees.png';
var TREE = 'img/tree.png';

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
var BG_SOUND = "se/background_bgm.mp3";

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
	core.fps = 15;

	// ゲームで使用する画像ファイルを指定する
	core.preload(BACKGROUND_IMG, LEFT_BUTTON, RIGHT_BUTTON, BACKGROUND_TREES_IMG, TREE, PLAYER_LIST[0], PLAYER_LIST[1], PLAYER_LIST[2], PLAYER_LIST[3], START_IMG, GAME_OVER_IMG, BG_SOUND);


	// 音
	core.se1 = Sound.load(BG_SOUND);
	core.se1.value = 0.1;

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
		var group_forest = new Group();
		scene.addChild(group_forest);

		var group_tree = new Group();
		scene.addChild(group_tree);
		
		// プレ背景の動作
		scene.onenterframe = function(){
			if (core.frame % 40 == 0) {
				// 左の開始配置(外野)
				var left_forest = new BgForest(-90, 80, true);

				// 右の開始配置(外野)
				var right_forest = new BgForest(125, 80, false);
			
				group_forest.insertBefore(left_forest, group_forest.firstChild);
				group_forest.insertBefore(right_forest, group_forest.firstChild);
			}
		};

		// ゲーム開始メッセージ表示
		var gameStart = new Sprite(236, 48);
		gameStart.x = (320 - 236) / 2;
		gameStart.y = (320 - 48) / 2;
		gameStart.image = core.assets[START_IMG];

		gameStart.addEventListener(Event.TOUCH_END, function() {
			this.remove();
			group_forest.remove();
			group_tree.remove();
			core.se1.play();
			core.pushScene(core.runnerScene());
		});

		scene.addChild(gameStart);

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
		var group_forest = new Group();
		scene.addChild(group_forest);

		var group_tree = new Group();
		scene.addChild(group_tree);

		// 忍者生成予定
		// 忍者をシーンに追加
		var player = new Player(32, 32);
		scene.addChild(player);
		
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

		var scaleX = 0.1;
		var scaleY = 0.1;
		var addX = 0;
		var addY = 1;
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
			timeLabel.text = "走った時間: " + minitu + " 分 " + second + " 秒";			

			if (core.frame % 40 == 0) {
				// 左の開始配置(外野)
				var left_forest = new BgForest(-90, 80, true);

				// 右の開始配置(外野)
				var right_forest = new BgForest(125, 80, false);
			
				group_forest.insertBefore(left_forest, group_forest.firstChild);
				group_forest.insertBefore(right_forest, group_forest.firstChild);
			}

			//if (core.frame % 50 == 0) {
			if (core.frame % 20 == 0) {
				var main_tree = new Tree(128, 40, Math.floor(Math.random() * Math.floor(5)));
				main_tree.addEventListener(Event.ENTER_FRAME, function() {
					if (core.frame % 3 == 0){
						if (this.y > 185) {
							// 木と衝突判定
							if (this.x < player.x && this.x + 30 > player.x) {
								core.pushScene(core.gameOverScene());
								group_forest.remove();
								group_tree.remove();
								player.remove();
								leftBt.remove();
								rightBt.remove();
								core.se1.stop();
								return;
							} else {
								this.remove();
							}
						} else if (this.y <= 185 && this.y > 180){
							if (this.position == 0){
								addX = -3;
							}
		
							if (this.position == 1){
								addX = -1.5;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 1.5;
							}
		
							if (this.position == 4){
								addX = 3;
							}
							addY = 3;
							scaleX = 1.1;
							scaleY = 1.1;
						} else if (this.y <= 180 && this.y > 160){
							if (this.position == 0){
								addX = -4;
							}
		
							if (this.position == 1){
								addX = -1.6;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 1.6;
							}
		
							if (this.position == 4){
								addX = 4;
							}
		
							addY = 5;
							scaleX = 1.1;
							scaleY = 1.1;
						} else if (this.y <= 160 && this.y > 130){
							if (this.position == 0){
								addX = -2;
							}
		
							if (this.position == 1){
								addX = -1.3;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 1.3;
							}
		
							if (this.position == 4){
								addX = 2;
							}
		
							addY = 4;
							scaleX = 1.08;
							scaleY = 1.08;
		
						} else if (this.y <= 130 && this.y > 100){
							if (this.position == 0){
								addX = -1.5;
							}
		
							if (this.position == 1){
								addX = -0.7;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 0.7;
							}
		
							if (this.position == 4){
								addX = 1.5;
							}
							addY = 3;
							scaleX = 1.06;
							scaleY = 1.06;
						} else if (this.y <= 100 && this.y > 50){
							if (this.position == 0){
								addX = -1;
							}
		
							if (this.position == 1){
								addX = -0.6;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 0.6;
							}
		
							if (this.position == 4){
								addX = 1;
							}
		
							addY = 2;
							scaleX = 1.04;
							scaleY = 1.03;
						} else {
							if (this.position == 0){
								addX = -0.5;
							}
		
							if (this.position == 1){
								addX = -0.3;
							}
		
							if (this.position == 2){
								addX = 0;
							}
		
							if (this.position == 3){
								addX = 0.3;
							}
		
							if (this.position == 4){
								addX = 0.5;
							}
							scaleX = 1.03;
							scaleY = 1.01;
						}
						
						this.x += addX;
						this.y += addY;
						this.scale(scaleX, scaleY);
					}
				});

				group_tree.insertBefore(main_tree, group_tree.firstChild);
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
		gameOver.y = (320 - 97) / 2;
		gameOver.image = core.assets[GAME_OVER_IMG];
				
		gameOver.addEventListener(Event.TOUCH_END, function() {
			//core.popScene();
			location.reload();
		});

		scene.addChild(gameOver);

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

		this.addEventListener(Event.ENTER_FRAME, function() {
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
		});
	}
});

// 障害物の生成
var Tree = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, position) {
		enchant.Sprite.call(this, 64, 126);
		this.image = core.assets[TREE];
		this.position = position;
		this.x = x;
		this.y = y;

		var scaleX = 0.1;
		var scaleY = 0.1;
		this.scale(scaleX, scaleY);
	}
});

// 左右の背景に当たる森林の生成
var BgForest = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, leftRightLFlg) {
		enchant.Sprite.call(this, 285, 120);
		this.image = core.assets[BACKGROUND_TREES_IMG];

		// 初期の縮小比率
		var scaleX = 0.5;
		var scaleY = 0.5;
		this.scale(scaleX, scaleY);
		this.x = x;
		this.y = y;
		
		this.addEventListener(Event.ENTER_FRAME, function() {
			if (core.frame % 4 == 0){
				if (this.y > 200){
					this.remove();
				} else if (this.y <= 200 && this.y > 190){
					delete this;
					if (leftRightLFlg){
						this.x -= 500;
					} else {
						this.x += 500;
					}

					this.y += 20;
					scaleX = 1.4;
					scaleY = 1.4;
				} else if (this.y <= 190 && this.y > 180){
					if (leftRightLFlg){
						this.x -= 85;
					} else {
						this.x += 85;
					}

					this.y += 15;
					scaleX = 1.4;
					scaleY = 1.4;
				} else if (this.y <= 180 && this.y > 160){
					if (leftRightLFlg){
						this.x -= 40;
					} else {
						this.x += 40;
					}

					this.y += 12;
					scaleX = 1.2;
					scaleY = 1.2;
				} else if (this.y <= 160 && this.y > 140){
					if (leftRightLFlg){
						this.x -= 25;
					} else {
						this.x += 25;
					}

					this.y += 12;
					scaleX = 1.15;
					scaleY = 1.15;
				} else if (this.y <= 140 && this.y > 120){
					if (leftRightLFlg){
						this.x -= 12;
					} else {
						this.x += 12;
					}

					this.y += 8;
					scaleX = 1.08;
					scaleY = 1.08;
				} else if (this.y <= 120 && this.y > 100){
					if (leftRightLFlg){
						this.x -= 6;
					} else {
						this.x += 6;
					}
					
					this.y += 4;
					scaleX = 1.03;
					scaleY = 1.03;
				} else if (this.y <= 100 && this.y > 80){
					if (leftRightLFlg){
						this.x -= 3;
					} else {
						this.x += 3;
					}
					this.frame = 5;
					this.y += 3;
					scaleX = 1.01;
					scaleY = 1.01;
				} else if (this.y <= 80){
					if (leftRightLFlg){
						this.x -= 1;
					} else {
						this.x += 1;
					}

					this.y += 1;
					scaleX = 1.00;
					scaleY = 1.00;
				}

				this.scale(scaleX, scaleY);
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