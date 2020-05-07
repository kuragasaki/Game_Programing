// enchant.js本体やクラスをエクスポート
enchant();

// 鯉の固定位置
var POINT_X = 100;
var POINT_Y = 165;

// 各イメージ画像のパス
var BACKGROUND_IMG = 'img/game_bg.png';
var KOI_PLAYER_IMG = 'img/koi.png';
var WAVE_IMG = 'img/wave.png';
//var SE_NAMI1 = "se/nami_v3.wav";
//var SE_NAMI2 = "se/ocean.wav";
//var SE_JUMP1 ="se/jump01.wav";

var SE_NAMI1 = "se/nami1.mp3";
var SE_NAMI2 = "se/nami2.mp3";
var SE_JUMP1 ="se/jump01.mp3";

// 鯉（プレイヤー）変数
var player = null;

// 波（障害物）変数
var wave = null;

// 得点
score = 0;

// 鯉（プレイヤー）の生成
var KoiPlayer = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		enchant.Sprite.call(this, x, y);
		this.x = POINT_X;
		this.y = POINT_Y;
		this.rotation = -15;
		this.moveFlg = true;
		this.jumpUp = false;
		this.jumpDown = false;
		this.endFlg = false;
		this.image = core.assets[KOI_PLAYER_IMG];

		this.addEventListener(Event.ENTER_FRAME, function() {
			if (this.moveFlg) {
				core.se2.duration = 2;
				core.se2.play();
				if (this.rotation == 0) {
					this.rotation = -15;
				} else {
					this.rotation = 0;
				}
			}

			if (this.jumpUp && this.jumpDown) {
				// ジャンプ後のY座標の最高値到達時の処理
				if (this.rotation <= 40) {
					if (this.rotation < 0) {
						this.y -= 10;
					} else {
						this.y += 5;
					}
					this.rotation += 20;
				} else {
					this.jumpUp = false;
				}
			}

			if (this.jumpUp && !this.jumpDown) {
				// ジャンプアクション後のY座標の最高値到達までの上昇処理
				if (POINT_Y - 40 <= this.y) {
					this.y -= 10;
					this.rotation = -45;
					core.se3.play();
				} else {
					this.jumpDown = true;
				}
			}

			if (!this.jumpUp && this.jumpDown) {
				// ジャンプアクション後のY座標の最高値到達後のから水面までの落下処理
				if (POINT_Y + 50 > this.y) {
					this.y += 10;
				} else {
					this.rotation = -15;
					this.jumpDown = false;
					this.moveFlg = true;
					this.y = POINT_Y;
				}
			}

			if (this.endFlg) {
				core.se2.stop();
				core.se3.stop();
				if (this.x < -40) {
					core.se1.stop();
					core.pushScene(core.lose());
				}

				this.x -= 10;
				this.rotation -= 10;
			}
		});

		core.rootScene.addChild(this);
	}
});

// 波（障害物）の生成
var Wave = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		enchant.Sprite.call(this, x, y);
		this.x = 310;
		this.y = 110;
		this.rotation = -15;
		this.image = core.assets[WAVE_IMG];

		this.addEventListener(Event.ENTER_FRAME, function() {
			this.x -= 10;
			this.y += 2;

			if (this.x < -60) {
				core.rootScene.removeChild(this);
				delete this;
			}

			if (this.within(player, 35)) {
				core.se1.play();
				player.moveFlg = false;
				player.jumpUp = false;
				player.jumpDown = false;
				player.endFlg = true;
			} else if (this.x == player.x) {
				score += 100;
			}
		});
		core.rootScene.addChild(this);
	}
});

// ページが読み込まれたときに実行される関数
window.onload = function() {

	// ゲームオブジェクトの作成
	core = new Core(320, 320);

	// ゲーム初期処理
	// fps(1秒間当たりの画面の描画回数)を設定する（省略時は「30」）
	core.fps = 10;

	// 継続時間（秒）
	core.timeCount = 0;

	// 一時的な時間保存
	core.tmpTime = 10;

	// ゲームで使用する画像ファイルを指定する
	core.preload(KOI_PLAYER_IMG, WAVE_IMG, BACKGROUND_IMG, SE_NAMI1, SE_NAMI2, SE_JUMP1);

	// 効果音1
	core.se1 = Sound.load(SE_NAMI1);
	core.se1.value = 0.2;
//	core.se1.duration = 10;

	// 効果音2
	core.se2 = Sound.load(SE_NAMI2);
	core.se2.value = 0.2;
	core.se2.duration = 10;

	// ジャンプ音
	core.se3 = Sound.load(SE_JUMP1);
	core.se3.value = 0.2;
//	core.se3.duration = 2;

	// 経過時間ラベル
	var timeLabel = new Label("TIME:" + core.timeCount);

	// スコアラベルを作成する
	var scoreLabel = new Label();

	// ゲーム終了ラベルを作成する
	var endLabel = new Label();

	// ファイルのプリロードが完成した時に実行される関数
	core.onload = function() {

		// 鯉（プレイヤー）を作成する
		player = new KoiPlayer(60, 40, core.se2);

		// 背景を表示するためのスプライトを作成する
		var bg = new Sprite(320, 320);
		// スプライトにサーフェスを設定する
		bg.image = core.assets[BACKGROUND_IMG];

		// 画面全体をタッチ可能範囲とする
		bg.addEventListener(Event.TOUCH_START, function() {

			player.moveFlg = false;
			player.jumpUp = true;
		});

		core.rootScene.addChild(bg);

		// ラベルを作成する
		var infoLabel = new Label('鯉の川登り');
		// 表示位置のx座標を設定する
		infoLabel.x = 5;
		// 表示位置のy座標を設定する
		infoLabel.y = 0;
		// 文字色を設定する
		infoLabel.color = '#0000FF';
		// フォントサイズとフォントの種類を指定する
		infoLabel.font = '14px sens-serif';

		// rootSceneにラベルを追加する
		core.rootScene.addChild(infoLabel);

		// 経過時間ラベルを作成する
		timeLabel.x = 100;
		timeLabel.y = 0;
		// 文字色を設定する
		timeLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		timeLabel.font = '14px sens-serif';
		core.rootScene.addChild(timeLabel);

		// スコアラベルを作成する
		scoreLabel.x = 270;
		scoreLabel.y = 0;
		scoreLabel.text = 0;
		// 文字色を設定する
		scoreLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		scoreLabel.font = '14px sens-serif';
		core.rootScene.addChild(scoreLabel);

		// ゲーム終了ラベルの設定だけをする
		core.rootScene.addChild(endLabel);

		var createTime = 6;
		// 画面全体をタッチ可能範囲とする
		core.rootScene.addEventListener(Event.ENTER_FRAME, function() {

			core.timeCount++;

			// fps == 10の場合、10fpsイコール1秒
			var viewWave = core.timeCount / core.fps;

			if (core.fps == 20) {
				viewWave += 30;
			}

			if (core.fps == 30) {
				viewWave += 80;
			}

			if (viewWave - core.tmpTime >= createTime) {
				var random = Math.floor( Math.random() * 11 );
				if (random < createTime) {

					// 波（障害物）を発生させる
					wave = new Wave(60, 45);
					core.tmpTime = viewWave;
				}
			}

			var minitu = Math.floor(viewWave / 60);
			var second = Math.floor(viewWave) % 60;
			timeLabel.text = minitu + " 分 " + second + " 秒";

			if (minitu == 3) {
				core.fps = 30;
			} else if (minitu == 2) {
				createTime = 2;
			} else if (minitu == 1) {
				core.fps = 20;
				createTime = 6;
			} else if (second > 30) {
				createTime = 3;
			}

			scoreLabel.text = score;
		});
	}

	// ゲーム終了
	core.lose = function() {
		var scene = new Scene();

		// 経過時間ラベル
		timeLabel.font = '20px sens-serif';
		timeLabel.text = timeLabel.text + " 泳いだ。";
		timeLabel.x = 20;
		timeLabel.y = 30;

		// スコアラベルを作成する
		scoreLabel.font = '20px sens-serif';
		scoreLabel.x = 20;
		scoreLabel.y = 60;
		scoreLabel.text = "得点: " + scoreLabel.text;

		// 表示位置のx座標を設定する
		endLabel.x = 60;
		// 表示位置のy座標を設定する
		endLabel.y = 120;
		// 文字色を設定する
		endLabel.color = '#000000';
		// フォントサイズとフォントの種類を指定する
		endLabel.font = '36px sens-serif';
		endLabel.text = "GAME END";

		return scene;
	}

	// ゲームスタート
	core.start();
}