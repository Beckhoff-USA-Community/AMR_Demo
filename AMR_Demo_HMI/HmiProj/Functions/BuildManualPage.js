// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.14.3.154/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HmiProj;
        (function (HmiProj) {

            var ucArray = [];
            var padding = 20;
            var width = 200;
            var height = 150;
            var targetPLC;

            function BuildManualPage(ParentControl, EntryPOU, TargetPLC) {
                targetPLC = TargetPLC;
                TcHmi.Symbol.writeEx('%s%AddSymbols|Timeout=10000%/s%', {domain: "ADS"}, async function (data)  {
                    if (data.error === TcHmi.Errors.NONE) {
                        const manualContent = await TcHmiSymbolReadAsync('%s%ADS.'+TargetPLC+'.'+EntryPOU+'.MachineHmiTree.SystemHmiTree%/s%');
                        const manualContentJson = JSON.parse(manualContent);
                        console.log(manualContentJson);
                        JsonKeyValuePairs(manualContent);
                    }
                });

                function JsonKeyValuePairs(jsonString) {
                   try {
                       const jsonObject = JSON.parse(jsonString);
                       var idx = 1;
                       var col = 1;
                       var row = 1;

                       function traverse(obj, path = '') {
                           for (const key in obj) {
                               const value = obj[key];

                               if (value.length > 0){
                                       for (let i = 0; i < value.length; i++) {
                                      var linkPath = value[i].LinkPath.replaceAll("[", ".").replaceAll("]", "");
                                      console.log(`ControlType: ${value[i].ControlType}, LinkPath: ${linkPath}`);
                                      addUc(idx, col, row, value[i].ControlType, linkPath);
                                      ParentControl.addChild(ucArray[idx]);
                                      if (col >= 3){
                                           row++;
                                           col = 1;
                                      }else{
                                           col++;
                                      }
                                      idx++;
                                    }
                                    row++;
                                    col = 1;
                               }
                           }
                       }
                     traverse(jsonObject);
                   } catch (error) {
                     console.error('Invalid JSON string:', error.message);
                   }
                }
            }

            function TcHmiSymbolReadAsync(symbolExpression) {
                return new Promise((resolve, reject) => {
                    TcHmi.Symbol.readEx2(symbolExpression, function(data) {
                      if (data.error === TcHmi.Errors.NONE)
                        resolve(data.value);
                      else
                        return reject(data.error);
                    });
                })
            }

            function addUc(idx, col, row, UserControl, Link){

                ucArray[idx] = TcHmi.ControlFactory.createEx(
                     'TcHmi.Controls.System.TcHmiUserControlHost' ,
                     'Uc' + idx ,
                     {
                         'data-tchmi-target-user-control': 'UserControls/Panels/'+UserControl+'Panel.usercontrol',
                         'data-tchmi-top':  ((row - 1) * (height + padding)), 
                         'data-tchmi-top-unit': 'px',
                         'data-tchmi-left': ((col - 1) * (width + padding)), 
                         'data-tchmi-left-unit': 'px',
                         'data-tchmi-width': width, 
                         'data-tchmi-width-unit': 'px',
                         'data-tchmi-height': height, 
                         'data-tchmi-height-unit': 'px',
                         'data-tchmi-data': '%s%ADS.'+targetPLC+'.'+Link+'%/s%'   
                     }
                 ); 
            }

            HmiProj.BuildManualPage = BuildManualPage;
        })(HmiProj = Functions.HmiProj || (Functions.HmiProj = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('BuildManualPage', 'TcHmi.Functions.HmiProj', TcHmi.Functions.HmiProj.BuildManualPage);
