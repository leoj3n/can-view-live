/*can-view-live@3.2.0#lib/html*/
define([
    'require',
    'exports',
    'module',
    './core',
    'can-view-nodelist',
    'can-util/dom/frag',
    'can-util/js/make-array',
    'can-util/dom/child-nodes',
    'can-reflect'
], function (require, exports, module) {
    var live = require('./core');
    var nodeLists = require('can-view-nodelist');
    var makeFrag = require('can-util/dom/frag');
    var makeArray = require('can-util/js/make-array');
    var childNodes = require('can-util/dom/child-nodes');
    var canReflect = require('can-reflect');
    live.html = function (el, compute, parentNode, nodeList) {
        var data, makeAndPut, nodes;
        parentNode = live.getParentNode(el, parentNode);
        data = live.listen(parentNode, compute, function (newVal) {
            var attached = nodeLists.first(nodes).parentNode;
            if (attached) {
                makeAndPut(newVal);
            }
            var pn = nodeLists.first(nodes).parentNode;
            data.teardownCheck(pn);
            live.callChildMutationCallback(pn);
        });
        nodes = nodeList || [el];
        makeAndPut = function (val) {
            var isFunction = typeof val === 'function', frag = makeFrag(isFunction ? '' : val), oldNodes = makeArray(nodes);
            live.addTextNodeIfNoChildren(frag);
            oldNodes = nodeLists.update(nodes, childNodes(frag));
            if (isFunction) {
                val(frag.firstChild);
            }
            nodeLists.replace(oldNodes, frag);
        };
        data.nodeList = nodes;
        if (!nodeList) {
            nodeLists.register(nodes, data.teardownCheck);
        } else {
            nodeList.unregistered = data.teardownCheck;
        }
        makeAndPut(canReflect.getValue(compute));
    };
});