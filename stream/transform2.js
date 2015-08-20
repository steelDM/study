var util = require('util');
var Transform = require('stream').Transform;
util.inherits(SimpleProtocol, Transform);


function SimpleProtocol(options) {
  //该方法必须实例化调用
  if (!(this instanceof SimpleProtocol))
    return new SimpleProtocol(options);

  Transform.call(this, options);
  this._inBody = false;
  this._sawFirstCr = false;
  this._rawHeader = [];
  this.header = null;
}

SimpleProtocol.prototype._transform = function(chunk, encoding, done) {

  // 如果不能解析则提供原数据，否则就提供处理完后的数据
  if (!this._inBody) {
    // 检查数据块是否有 \n\n
    var split = -1;
    for (var i = 0; i < chunk.length; i++) {
      if (chunk[i] === 10) { // '\n'
        if (this._sawFirstCr) {
          split = i;
          break;
        } else {
          this._sawFirstCr = true;
        }
      } else {
        this._sawFirstCr = false;
      }
    }

    if (split === -1) {
      // 仍旧等待 \n\n
      // 暂存数据块并重试。
      this._rawHeader.push(chunk);
    } else {
      this._inBody = true;
      var h = chunk.slice(0, split);
      this._rawHeader.push(h);
      var header = Buffer.concat(this._rawHeader).toString();
      try {
        this.header = JSON.parse(header);
      } catch (er) {
        this.emit('error', new Error('invalid simple protocol data'));
        return;
      }
      // 并让它们知道我们完成了头部解析。
      this.emit('header', this.header);
      // 现在，由于我们获得了一些额外的数据，先触发这个。
      this.push(chunk.slice(split));
    }
  } else {
    // 之后，仅需向我们的消费者原样提供数据。
    this.push(chunk);
  }
  //done是必须调用，告诉本次转移已经完成，等待下一次的_transform触发
  done();
};


// 用法:
// var parser = new SimpleProtocol();
// source.pipe(parser)
// 现在 parser 是一个会触发 'header' 并带上解析后的
// 头部数据的可读流。