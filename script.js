

class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth - 100,
      height: window.innerHeight -100,
    }

    this.canvas = document.getElementById('canvas');

    this.aspectRatio = 16 / 9;
    this.videoList = [
      {
        name: 'video01',
        path: 'video01.mp4',
      },
      // {
      //   name: 'video02',
      //   path: 'video02.mp4',
      // },
      // {
      //   name: 'video03',
      //   path: 'video03.mp4',
      // }
    ];

    this.backgrounds = {};

    this.app = new PIXI.Application({
      width: window.innerWidth - 100,
      height: window.innerHeight - 100,
      view: this.canvas,
      // backgroundColor: 0x1099bb,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
    });
    this.app.stage.eventMode = 'static';

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);


    this.displacementSprite = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
    // this.displacementSprite = PIXI.Sprite.from('filter.png');
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


    // this.app.ticker.add((delta) => this.update(delta));

    this._init();

    this._addEvent();
  }

  _init() {
    this._setupBgVideo();
    this._setupDisplacementFilter()
  }

  _setupBgVideo() {
    this.videoList.forEach((video) => {
      const videoTexture = PIXI.Texture.from(video.path); // videoのサイズは16:9にする
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.name = video.name;

      const videoElement = videoTexture.baseTexture.resource.source;
      videoElement.muted = true; // ビデオをミュートに設定
      videoElement.loop = true; // ビデオをループに設定

      this._resizeVideoSprite(videoSprite);
      this.container.addChild(videoSprite);
    });
  }

  // 動画サイズ設定
  _resizeVideoSprite(videoSprite) {
    
    // 高さ揃えでサイズ設定
    const height = this.viewport.height;
    const width = height * this.aspectRatio;

    // スプライトのサイズと位置を更新
    videoSprite.width = width;
    videoSprite.height = height;
    videoSprite.x = this.viewport.width / 2 - width / 2;
    // videoSprite.y = this.viewport.height / 2;
  }

  _setupDisplacementFilter() {
    const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
    this.container.filters = [displacementFilter];

    displacementFilter.padding = 10;
    displacementFilter.scale.y = 500;


    this.app.stage.addChild(this.displacementSprite);
  }

  // update(delta) {

  // }

  _reseize() {
    this.viewport.width = window.innerWidth - 100;
    this.viewport.height = window.innerHeight - 100;
    this.app.renderer.resize(this.viewport.width, this.viewport.height);
  }

  _addEvent() {
    window.addEventListener('resize', this._reseize.bind(this));
  }
}

window.addEventListener('load', () => {
  new Main();
});