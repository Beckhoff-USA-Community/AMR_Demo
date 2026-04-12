// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.14.3.178/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HmiProj;
        (function (HmiProj) {
            function GetKinematicStatus(KinStatus) {
                var arr = ['Error', 'Joint Mode (ACS)', 'Unknown', 'Start Pending', 'Cartesian Mode (MCS)']
                return arr[KinStatus];
            }
            HmiProj.GetKinematicStatus = GetKinematicStatus;
        })(HmiProj = Functions.HmiProj || (Functions.HmiProj = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('GetKinematicStatus', 'TcHmi.Functions.HmiProj', TcHmi.Functions.HmiProj.GetKinematicStatus);
