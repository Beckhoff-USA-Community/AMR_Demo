// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.14.3.154/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HmiProj;
        (function (HmiProj) {
            function GetModeName(Mode) {
                var arr = ['Invalid', 'Production', 'Maintenance', 'Manual']
                return arr[Mode];
            }
            HmiProj.GetModeName = GetModeName;
        })(HmiProj = Functions.HmiProj || (Functions.HmiProj = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('GetModeName', 'TcHmi.Functions.HmiProj', TcHmi.Functions.HmiProj.GetModeName);
