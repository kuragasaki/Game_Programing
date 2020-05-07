// enchant.js本体やクラスをエクスポート
enchant();

// ページが読み込まれたときに実行される関数
window.onload = function() {

	// ゲームオブジェクトの作成
	core = new Core(320, 320);

	// ゲーム初期化処理

	// fps(1秒間当たりの画面の描画回数)を設定する（省略時は「30」）
	core.fps = 16;

	// ゲームで使用する画像ファイルを指定する
	core.preload('img/chara3.png', 'img/map1.png');

	// ファイルのプリロードが完成した時に実行される関数
	core.onload = function() {

		// サーフェスを作成する
		var image = new Surface(320, 320);
		/*
		 * 「map1.png」の（0, 96）の位置から幅「126」ピクセル、高さ「64」ピクセルの領域を
		 * サーフェスの（64, 64）の位置に幅「126」ピクセル、高さ「64」ピクセルで描画する
		 */
		image.draw(core.assets['img/map1.png'], 0, 48, 126, 64, 64, 64, 256, 128);

		// サーフェスを表示するためのスプライトを作成する
		var bg = new Sprite(320, 320);
		// スプライトにサーフェスを設定する
		bg.image = image;

		core.rootScene.addChild(bg);

		// スプライトを作成する
		var player = new Sprite(32, 32);
		// スプライトで表示する画像を設定する
		player.image = core.assets['img/chara3.png'];
		// 表示するフレームの番号を設定する
		player.frame = 3;
		// 表示位置のx座標を設定する
		player.x = 120;
		// 表示位置のy座標を設定する
		player.y = 50;

		// フレーム数をカウントするプロパティを追加する
		player.tick = 0;

		// rootSceneにスプライトを追加する
		core.rootScene.addChild(player);

		// 「enterframe」イベントが発生したときに実行するリスナを登録する
		player.addEventListener('enterframe', function(e) {

			// 左ボタンが押されたら、スプライトをx方向に「-4」ピクセル移動する
			if (core.input.left) {
				this.x -= 4;

				// スプライトのフレーム番号を切り替えてアニメーション表示する
				this.frame = 9;
				//				this.frame = this.tick % 6 * 6 + 3;
				// フレーム数をインクリメントする
//				this.tick ++;
			}

			// 右ボタンが押されたら、スプライトをx方向に「+4」ピクセル移動する
			if (core.input.right) {
				this.x += 4;
				// スプライトのフレーム番号を切り替えてアニメーション表示する
				this.frame = 15;
				//				this.frame = this.tick % 6 * 6 + 5;
				// フレーム数をインクリメントする
//				this.tick ++;
			}

			// 上ボタンが押されたら、スプライトをy方向に「-4」ピクセル移動する
			if (core.input.up) {
				this.y -= 4;
				// スプライトのフレーム番号を切り替えてアニメーション表示する
				this.frame = 21;
//				this.frame = this.tick % 6 * 6 + 4;
				// フレーム数をインクリメントする
//				this.tick ++;
			}

			// 下ボタンが押されたら、スプライトをy方向に「+4」ピクセル移動する
			if (core.input.down) {
				this.y += 4;
				// スプライトのフレーム番号を切り替えてアニメーション表示する
				this.frame = 3;
//				this.frame = this.tick % 4 * 4;
				// フレーム数をインクリメントする
//				this.tick ++;
			}
		})

		// 「touchmove」イベントが発生したときに実行するリスナを登録する
		player.addEventListener('touchmove', function(e) {

			// スプライトをタッチして移動した場所、またはドラッグした場所に移動する
			this.x = e.x - this.width / 2;
			this.y = e.y - this.height / 2;
		})

		// ラベルを作成する
		var infoLabel = new Label('enchant.js サンプル');
		// 表示位置のx座標を設定する
		infoLabel.x = 16;
		// 表示位置のy座標を設定する
		infoLabel.y = 0;
		// 文字色を設定する
		infoLabel.color = '#0000FF';
		// フォントサイズとフォントの種類を指定する
		infoLabel.font = '14px sens-serif';

		// rootSceneにラベルを追加する
		core.rootScene.addChild(infoLabel);


//		core.rootScene.backgroundColor  = '#7ecef4';
	}

	// ゲームスタート
	core.start();
}