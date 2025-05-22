module.exports = function (RED) {
  "use strict"; //啟用 JavaScript 的嚴格模式（Strict Mode），讓JavaScript在執行時更嚴謹地檢查程式碼
  const moduleData = require('../../modelData/moduleData.js');

  function YottaReadDoNode(config) {
    RED.nodes.createNode(this, config);

    this.model = config.model;
    this.modelQty = Number(config.modelQty);
    this.modbusId = Number(config.modbusId);
    this.modbusQty = Number(config.modbusQty);
    this.modbusAddr = Number(config.modbusAddr);

    var node = this;    
    var fc;
    var text ="";
    
    if(node.modbusQty>1) text = `...DO ${node.modelQty + node.modbusQty}`;
    node.status({fill:"grey",shape:"dot",text:"DO "+ node.modelQty + text}); //在外觀顯示該節點是read or write

    this.on("input", function (msg) {
      
      const modbusId = Number(config.modbusId);
      const modbusQty = Number(config.modbusQty);
      
      if (!modbusId || isNaN(modbusId)) {
          node.error("Modbus Id 必須是大於 0 的數字", msg);
          return;
      } 

      if (!modbusQty || isNaN(modbusQty)) {
          node.error("數量必須是大於 0 的數字", msg);
          return;
      } 
      
      
      fc = (node.modbusQty > 1) ? 15 : 5;
    
      msg.payload = { 
        value: msg.payload,
        'fc': fc,
        'unitid': node.modbusId, 
        'address': node.modbusAddr , 
        'quantity': node.modbusQty
      } 

      node.send(msg);     
      
      
    });
  }
  RED.nodes.registerType("Write_DO", YottaReadDoNode);

  RED.httpAdmin.get("/Write_DO/:command", RED.auth.needsPermission('commandfield.read'), function(req,res) {        
      res.json(moduleData);
  });
};

