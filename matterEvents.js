//matterEvents.js

//当たり判定を設定 ThreeSampleクラス内で実体化して使用
class MatterEvents {
  constructor(threeScene) {
    this.threeScene = threeScene;

    //当たり判定イベント
    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      pairs.forEach((pair) => {
        //ボールじゃないければreturnで何もしない
        if (pair.bodyA.ball === undefined) return;
        if (pair.bodyB.ball === undefined) return;
        //接触した双方がボールならカラーを入れ替える
        var colorA = pair.bodyA.ball.material.color;
        var colorB = pair.bodyB.ball.material.color;
        pair.bodyA.ball.material.color = colorB;
        pair.bodyB.ball.material.color = colorA;
      });
    });
  }
}