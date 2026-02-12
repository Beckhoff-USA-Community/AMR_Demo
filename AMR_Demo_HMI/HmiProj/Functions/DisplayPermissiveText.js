// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.14.3.178/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HmiProj;
        (function (HmiProj) {
            function DisplayPermissiveText(Permissive, Control) {

                var prevText = Control.getText();
                var prevSize = Control.getTextFontSize();

                setTimeout(() => {
                    Control.setIsEnabled(true);
                    Control.setTextFontSize(prevSize);
                    Control.setText(prevText);
                }, 2000);

                if (Permissive._OK) {
                    return true;
                } else{

                    for (let i = 0; i <= 9; i++) {
                        if (Permissive.Permissive[i] == false) {
                            Control.setText(Permissive.PermissiveReason[i]);
                            break; 
                        }
                    }

                    Control.setIsEnabled(false);
                    Control.setTextFontSize(11);
                    return false;
                }
            }
            HmiProj.DisplayPermissiveText = DisplayPermissiveText;
        })(HmiProj = Functions.HmiProj || (Functions.HmiProj = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('DisplayPermissiveText', 'TcHmi.Functions.HmiProj', TcHmi.Functions.HmiProj.DisplayPermissiveText);
