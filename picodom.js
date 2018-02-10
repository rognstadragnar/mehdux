const t=Object.assign||function(t){for(var n,r=1;r<arguments.length;r++)for(var e in n=arguments[r])Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e]);return t};exports.connect=function(n,r,e){return function(o){return function(c){return o(t({},t({},n.getState(r),n.getActions(e)),c))}}};
//# sourceMappingURL=picodom.js.map
