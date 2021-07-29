// threeSample.js

//matterで使用する変数たち
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let engine = Engine.create();
let world = engine.world;

//重力設定を変更 default:0.001
world.gravity.scale = 0.0002;

//ボールとドットの摩擦などの設定
let optionsBall = {
  //摩擦 default:0.1
  friction: 0.0,
  //弾性 default:0
  restitution: 1,
};
let optionsStatic = {
  friction: 0.0,
  restitution: 1,
  //静的物質
  isStatic: true,
};

class ThreeSample {
  constructor() {
    //シーン作成
    this.threeScene = new THREE.Scene();
    //カメラ作成
    this.threeCamera = new THREE.OrthographicCamera(
      -(canvasWidth / 2),
      canvasWidth / 2,
      canvasHeight / 2,
      -(canvasHeight / 2),
      900,
      1300
    );
    //シーンにカメラを追加
    this.threeScene.add(this.threeCamera);
    //ライトを作成
    const light = new THREE.PointLight(0xffffff, 1, 0, 1);
    light.position.set(0, 300, 1000);
    this.threeScene.add(light);

    //レンダーを作成
    this.threeRender = new THREE.WebGLRenderer({ antialias: true });
    //レンダーのバックグラウンドカラー 色 α
    this.threeRender.setClearColor(0x000000, 1);
    //レンダーのサイズ
    this.threeRender.setSize(canvasWidth, canvasHeight);
    //影を有効
    this.threeRender.shadowMapEnabled = true;
    //カメラの位置
    this.threeCamera.position.set(0, 300, 1000);
    //カメラの向き
    this.threeCamera.lookAt(this.threeScene.position);

    //作成するボールの数
    this.createBallCount = 20;
    this.ballsList = [];
    //ピンの設定と表示
    let pinThickness = 5;
    let pinInterval = 150;

    //ピンのカラー
    let pinMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    //ピンの形
    this.geometryPin = new THREE.CylinderGeometry(
      pinThickness,
      pinThickness,
      80,
      10
    );
    //上の列のピン
    for (let x = pinInterval; x < 650; x += pinInterval) {
      //matterjsの設定
      this.pin = Bodies.circle(x, 100, pinThickness, optionsStatic);
      World.add(world, this.pin);
      //threejsの描画
      this.meshPin = new THREE.Mesh(this.geometryPin, pinMaterial);
      this.meshPin.position.x = x - canvasWidth / 2;
      this.meshPin.position.y = -(100 - canvasHeight / 2);
      //回転
      this.meshPin.rotation.x = 0.5 * Math.PI;
      this.threeScene.add(this.meshPin);
    }
    //下の列のピン
    for (let x = pinInterval / 2; x < 650; x += pinInterval) {
      this.pin = Bodies.circle(x, 250, pinThickness, optionsStatic);
      World.add(world, this.pin);
      this.meshPin = new THREE.Mesh(this.geometryPin, pinMaterial);
      this.meshPin.position.x = x - canvasWidth / 2;
      this.meshPin.position.y = -(250 - canvasHeight / 2);
      this.meshPin.rotation.x = 0.5 * Math.PI;
      this.threeScene.add(this.meshPin);
    }

    //threejsのレンダーをpixijsのテクスチャに
    this.threeTexture = PIXI.BaseTexture.from(
      this.threeRender.domElement,
      PIXI.SCALE_MODES.LINEAR
    );
    //pixijsのスプライトに
    this.threeSprite = new PIXI.Sprite.from(
      new PIXI.Texture(this.threeTexture)
    );
    //pixijsのステージに追加
    app.stage.addChild(this.threeSprite);

    //重なり順　zIndexを設定するたための設定
    app.stage.sortableChildren = true;
    //matter.jsのエンジンをスタート
    Engine.run(engine);
  }

  tick() {
    //指定の個数までボールを作成
    if (this.ballsList.length <= this.createBallCount) {
      this.ballsList.push(
        new MatterSphereMesh(
          this.threeScene,
          Math.random() * app.screen.width,
          -100,
          Math.random() * (30 - 40) + 30
        )
      );
    }
    //ボールのリストを順次更新
    this.ballsList.forEach((ball) => ball.tick());
    //threejsのrenderを更新
    this.threeRender.render(this.threeScene, this.threeCamera);
    this.threeTexture.update();
  }
}

//matter.jsと同期させる
class MatterSphereMesh {
  constructor(scene, x, y, w) {
    this.geometry = new THREE.SphereGeometry(w, 16, 16);
    this.material = new THREE.MeshStandardMaterial({
      color: this.getRandomColor(),
    });
    this.ball = new THREE.Mesh(this.geometry, this.material);

    // this.material = new THREE.PointsMaterial({
    //   color: this.getRandomColor(),
    //   //transparent: true,
    // });
    // this.ball = new THREE.Points(this.geometry, this.material);
    this.ball.position.x = x - canvasWidth / 2;
    this.ball.position.y = -(y - canvasHeight / 2);
    scene.add(this.ball);
    this.matterBody = Bodies.circle(x, y, w, optionsBall);
    World.add(world, this.matterBody);
  }
  tick() {
    let pos = this.matterBody.position;
    let angle = this.matterBody.angle;
    this.ball.position.x = pos.x - canvasWidth / 2;
    this.ball.position.y = -(pos.y - canvasHeight / 2);
    this.ball.rotation.z = -angle;
    //下に落ちたら上にワープさせる
    if (pos.y > 350) {
      Matter.Body.setPosition(this.matterBody, {
        x: Math.random() * app.screen.width,
        y: -60,
      });
    }
  }

  getRandomColor() {
    //フルカラーは"0123456789ABCDEF"
    var letters = "ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return new THREE.Color(parseInt(color.replace("#", "0x"), 16));
  }
}