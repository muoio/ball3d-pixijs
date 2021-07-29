// title.js

class TitleView {
    constructor(feedOutCount) {
      this.container = new PIXI.Container();
      this.container.zIndex = 1000;
      this.container.x = 16;
      this.container.y = 130;
      const line1Text = "three.js matter.js pixi.js";
      const line2Text = "matterjsのボール落下をthreejsで";
      const line3Text = "";
  
      app.stage.addChild(this.container);
  
      const style1 = new PIXI.TextStyle({
        //fontFamily: "Arial",
        fontSize: 42,
        //fontStyle: "italic",
        //fontWeight: "bold",
        fill: ["#ffffff", "#f17268"],
        stroke: "#4a1850",
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: "#777777",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        // wordWrap: true,
        // wordWrapWidth: 440,
      });
      const style2 = new PIXI.TextStyle({
        fontSize: 34,
        fill: "#ffffff",
        dropShadow: true,
        dropShadowColor: "#777777",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
      });
  
      this.text1 = new PIXI.Text(line1Text, style1);
      this.text1.anchor.set(0.5);
      this.text1.x = 300;
      this.text1.y = 50;
      this.text2 = new PIXI.Text(line2Text, style2);
      this.text2.anchor.set(0.5);
      this.text2.x = 300;
      this.text2.y = 100;
      this.text3 = new PIXI.Text(line3Text, style2);
      this.text3.anchor.set(0.5);
      this.text3.x = 300;
      this.text3.y = 150;
      this.textFps = new PIXI.Text("FPS:\t", { fontSize: 12, fill: "#ffffff" });
      this.textFps.x = 10;
      this.textFps.y = 20;
      this.container.rotation = -0.12;
      this.container.addChild(this.text1);
      this.container.addChild(this.text2);
      this.container.addChild(this.text3);
      app.stage.addChild(this.textFps);
      this.tickCount = 0;
      this.feedOutCount = feedOutCount;
      this.startTime = Date.now();
    }
  
    tick(delta) {
      let count = Date.now() - this.startTime;
      let second = count / 1000;
      let fpsAve = this.tickCount / second;
      this.textFps.text = "FPS(平均):\t" + fpsAve.toFixed(2);
      this.tickCount++;
      if (this.container.alpha <= 0.0) return;
      if (this.tickCount > this.feedOutCount) {
        this.container.alpha -= 0.03 * delta;
      }
    }
  }