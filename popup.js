var ConvnetCalc = function() {
  this.size = 28;
  this.filter = 3;
  this.stride = 1;
  this.padding = 0;
  this.output = 25;
  this.target = 'output';
  this.elements = ['size','filter','stride','padding','output']
}

ConvnetCalc.prototype.updateItemValue = function(key,value) {
  this[key] = value;
  var itemdom = document.getElementById(key)
  itemdom.value = value;
}

ConvnetCalc.prototype.getItemValue = function(key) {
  var itemdom = document.getElementById(key)
  return parseInt(itemdom.value)
}

ConvnetCalc.prototype.validateValues = function() {
  var output = Math.floor((this.size - this.filter + 2*this.padding)/this.stride) + 1;
  if(this.output !== output) {
    this.toggleWarning(true);
  }else {
    this.toggleWarning(false);
  }
}

//⌊(Size - Filter + 2*Padding)/Stride)⌋+1
ConvnetCalc.prototype.onItemValueChange = function(key,value) {
  this[key] = value;
  if(this.target == 'output'){
    switch(key){
      case 'size':
      case 'filter':
      case 'stride':
      case 'padding':
      var output = (this.size - this.filter + 2*this.padding)/this.stride + 1;
      this.updateItemValue('output',output);
      break;
    }
    this.validateValues();
  }else {
    switch(this.target) {
      case 'size':
        this.size = (this.output - 1) * this.stride - 2 * this.padding + this.filter;
        this.updateItemValue('size',this.size);
        break;
      case 'filter':
        this.filter = ((this.output - 1) * this.stride - 2 * this.padding - this.size)*-1
        this.updateItemValue('filter',this.filter);
        break;
      case 'stride':
        this.stride = Math.floor((this.size - this.filter + 2*this.padding) / (this.output - 1))
        this.updateItemValue('stride',this.stride);
        break;
      case 'padding':
        this.padding = Math.floor(((this.output - 1) * this.stride + this.filter - this.size) / 2)
        this.updateItemValue('padding',this.padding);
        break;
    }
    this.validateValues();
  }
}

ConvnetCalc.prototype.updateIndicator = function(key) {
  this.target = key;
  this.elements.forEach((item) => {
    var classactionname = (key == item) ? 'add' : 'remove'
    var attributeactionname = (key == item) ? 'setAttribute' : 'removeAttribute'
    document.getElementById(`${item}indicator`).classList[classactionname]('active')
    document.getElementById(`${item}`)[attributeactionname]('disabled','true')
  })
}

ConvnetCalc.prototype.toggleWarning = function(isopen) {
  var action = isopen ? 'remove' : 'add';
  document.getElementById('warning').classList[action]('hide')
}

var convnetcalc = new ConvnetCalc();


document.addEventListener('DOMContentLoaded',()=>{
  convnetcalc.elements.forEach((key)=>{
    document.getElementById(key).addEventListener('change',()=>{
      newvalue = convnetcalc.getItemValue(key)
      convnetcalc.onItemValueChange(key,newvalue)
    },false)  
    document.getElementById(`${key}indicator`).addEventListener('click',()=>{
      convnetcalc.updateIndicator(key)
    },false)
  })
  convnetcalc.updateIndicator(convnetcalc.target)
  document.getElementById('gotohomepage').addEventListener('click',()=>{
    var newURL = "https://www.zhihu.com/people/eeandrew/activities";
    chrome.tabs.create({ url: newURL });
  },false)
})