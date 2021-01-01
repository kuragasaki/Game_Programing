// enchant.js本体やクラスをエクスポート
enchant();

var BACKGROUND_IMG = 'img/background2.png';
var LEFT_TREE = 'img/left_tree.png';
var RIGHT_TREE = 'img/right_tree.png';
var LEFT_BUTTON = 'img/left_button.png';
var RIGHT_BUTTON = 'img/right_button.png';

var BACKGROUND_TREES_IMG = 'img/background_trees.png';
var TREE = 'img/tree.png';


// キャラクター画像用変数は、後々配列に変更する
var CARACTOR = 'img/tmp_caractor.jpg';

// 森林画像の横幅
var TREE_WIDTH = 105;
// 森林画像の縦幅
var TREE_HEIGHT = 80;

// ページが読み込まれたときに実行される関数
window.onload = function() {

	// ゲームオブジェクトの作成
	core = new Core(320, 320);

	// ゲーム初期化処理

	// fps(1秒間当たりの画面の描画回数)を設定する（省略時は「30」）
	core.fps = 60;

	// ゲームで使用する画像ファイルを指定する
	core.preload(BACKGROUND_IMG, LEFT_TREE, RIGHT_TREE, LEFT_BUTTON, RIGHT_BUTTON, CARACTOR, BACKGROUND_TREES_IMG, TREE);

	// ファイルのプリロードが完成した時に実行される関数
	core.onload = function() {
		// シーンの生成
		var mainScene = core.rootScene;

		// 背景設定
		var background = new Sprite(320, 320);
		background.image = core.assets[BACKGROUND_IMG];
		mainScene.addChild(background)

		// 忍者生成予定
		// 忍者をシーンに追加
		var player = new Player(32, 32);
		mainScene.addChild(player)

		
		mainScene.onenterframe = function(){
			if (core.frame % 60 == 0) {
				// 左の開始配置(外野)
				left_forest = new BgForest(-90, 80, true);

				// 右の開始配置(外野)
				right_forest = new BgForest(125, 80, false);
				mainScene.addChild(left_forest)
				mainScene.addChild(right_forest)
			}

			if (core.frame % 80 == 0) {
				mainScene.addChild(new Tree(128, 40, Math.floor(Math.random() * Math.floor(5))));
			}
		}

		// 左ボタン設定
		var leftBt = new ButtonClass(10, 320 - 60, core.assets[LEFT_BUTTON]);
		mainScene.addChild(leftBt);

		leftBt.addEventListener(Event.TOUCH_END, function() {
			player.x -= 40;
		});
				
		// 右ボタン設定
		var rightBt = new ButtonClass(320 - 60, 320 - 60, core.assets[RIGHT_BUTTON]);
		mainScene.addChild(rightBt);
		rightBt.addEventListener(Event.TOUCH_END, function() {
			player.x += 40;
		});		
	}

	// ゲームスタート
	core.start();
}

// プレイヤーの生成
var Player = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		enchant.Sprite.call(this, x, y);
		this.x = (320 - 32) / 2;
		this.y = 280;
		this.image = core.assets[CARACTOR];
		
		this.addEventListener(Event.ENTER_FRAME, function() {
		});
	}
});

// 障害物の生成
var Tree = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, position) {
		enchant.Sprite.call(this, 64, 126);
		this.image = core.assets[TREE];
		var scaleX = 0.1;
		var scaleY = 0.1;
		this.scale(scaleX, scaleY);

		this.x = x;
		this.y = y;
		var addX = 0;
		var addY = 1;
		this.addEventListener(Event.ENTER_FRAME, function() {
			if (core.frame % 10 == 0){
				if (this.y > 180){
					scaleX = 1;
					scaleY = 1;
					addY = 200;
				/*
				} else if (this.y <= 180 && this.y > 160){

					this.y += 3;
					scaleX = 1.2;
					scaleY = 1.2;
				*/
				} else if (this.y <= 180 && this.y > 160){
					if (position == 0){
						addX = -4;
					}

					if (position == 1){
						addX = -2;
					}

					if (position == 2){
						addX = 0;
					}

					if (position == 3){
						addX = 2;
					}

					if (position == 4){
						addX = 4;
					}

					addY = 5;
					scaleX = 1.1;
					scaleY = 1.1;

				} else if (this.y <= 160 && this.y > 130){
					if (position == 0){
						addX = -2;
					}

					if (position == 1){
						addX = -1.5;
					}

					if (position == 2){
						addX = 0;
					}

					if (position == 3){
						addX = 1.5;
					}

					if (position == 4){
						addX = 2;
					}

					addY = 4;
					scaleX = 1.08;
					scaleY = 1.08;

				} else if (this.y <= 130 && this.y > 100){
					if (position == 0){
						addX = -1.5;
					}

					if (position == 1){
						addX = -0.9;
					}

					if (position == 2){
						addX = 0;
					}

					if (position == 3){
						addX = 0.9;
					}

					if (position == 4){
						addX = 1.5;
					}
					addY = 3;
					scaleX = 1.06;
					scaleY = 1.06;
				} else if (this.y <= 100 && this.y > 50){
					if (position == 0){
						addX = -1;
					}

					if (position == 1){
						addX = -0.6;
					}

					if (position == 2){
						addX = 0;
					}

					if (position == 3){
						addX = 0.6;
					}

					if (position == 4){
						addX = 1;
					}

					addY = 2;
					scaleX = 1.04;
					scaleY = 1.03;
				} else {
					if (position == 0){
						addX = -0.5;
					}

					if (position == 1){
						addX = -0.3;
					}

					if (position == 2){
						addX = 0;
					}

					if (position == 3){
						addX = 0.3;
					}

					if (position == 4){
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
	}
});

// 左右の背景に当たる森林の生成
var BgForest = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, leftRightLFlg) {
		enchant.Sprite.call(this, 285, 120);
		this.image = core.assets[BACKGROUND_TREES_IMG];
		//this._element.style.zIndex = 20; // ※手前に描画したいものほど、値を大きく設定する事
		// 初期の縮小比率
		var scaleX = 0.5;
		var scaleY = 0.5;
		this.scale(scaleX, scaleY);

		// 道の三角図形 320 * 270 
		// グラフ１ y = ax + b ... 270 = 160a + b と 0 = 0a + b
		// グラフ２ y = ax + b ... 270 = 160a + b と 0 = 320a + b
		// this.x - this.width + グラフ１と２で使用するx座標
		// this.y - this.height + グラフ１と２で使用するy座標
		// 画面横位置座標 ? 左 160 - 横幅  右 230
		this.x = x;

		// 画面縦位置座標 ? 195 + 20
		this.y = y;
		
		this.addEventListener(Event.ENTER_FRAME, function() {
			if (core.frame % 10 == 0){
				if (this.y > 200){
					scaleX = 0;
					scaleY = 0;
					return;
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