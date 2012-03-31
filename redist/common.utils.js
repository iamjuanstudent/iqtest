/*global define, require, module */

(function(define) { define(function() {
    var u={
        // when onlyInSource is true, properties will not be added - only updated
        // passing a falsy value as the target results in a new object being created
        // and onlyInTarget is irrelevant
        extend: function (target) {
            var prop, source, sources, i,
                li = arguments.length,
                lastBool = u.isBool(arguments[li-1]),
                len = lastBool ?
                    li-2 : li-1,
                emptyTarget=!target,
                onlyInTarget = lastBool ?
                        arguments[len+1] : false;

                target = target||{};

                sources=u.toArray(arguments,1,len+1);

            for (i=0;i<sources.length;i++) {
                source = sources[i];
                for (prop in source) {
                    if (source.hasOwnProperty(prop) 
                        && (emptyTarget || !onlyInTarget || target.hasOwnProperty(prop))) {
                        target[prop] = source[prop];
                    }
                }
                // start honoring onlyInTarget after the first source
                emptyTarget=false;
            }
            return target;
        },
        // copy selected properties to a new object
        filter: function(source,what) {
            var target={},
                props = u.isArray(what) ? 
                what :
                what.split(',');

            u.each(props,function(i,prop) {
                target[prop]=source[prop];
            });
            return target;
        },
        toArray: function(arrLike,first,last) {
            return Array.prototype.slice.call(arrLike,first || 0, last || arrLike.length);
        },
        isArray: function (obj) {
            return obj && obj.constructor === Array;
        },
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isString: function(obj) {
            return typeof obj === 'string';
        },
        isBool: function(obj) {
            return typeof obj === 'boolean';
        },
        trim: function(str) {
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        },
        //split with trim (why would you want it any other way?)
        split: function(str,delim) {
            var result=[];
            u.each(str.split(str,delim),function(i,e) {
                result.push(u.trim(e));
            });
            return result;
        },
        // replaces {0}.. {n} with the ordinal valued parameter. You can also pass an 
        // array instead of multiple parameters
        format: function (text) {
            var args = (arguments.length === 2 && u.isArray(arguments[1])) ?
                arguments[1] :
                this.toArray(arguments,1);
            return text.replace(/\{(\d+)\}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
              ? String(args[number])
              : match
            ;
            });
        },
        // usual each, if you happen to pass a string, it will split it on commas.
        // it will always trim string values in an array.
        each: function (coll, cb) {
            var i,val;
            if (u.isString(coll))
            {
                coll=coll.split(',');
            }
            if (u.isArray(coll)) {
                for (i = 0; i < coll.length; i++) {
                    val = u.isString(coll[i]) ?
                        u.trim(coll[i]) : coll[i];

                    if (cb.call(val, i, val)===false) {
                        break;
                    }
                }
            } else {
                for (i in coll) {
                    if (coll.hasOwnProperty(i)) {
                        if (cb.call(coll[i], i, coll[i])===false) {
                            break;
                        }
                    }
                }
            }
        },
        // ugh
        event: function(func,that,parm) {
            if (u.isFunction(func)) {
                func.call(that,parm);
            }
        },
        donothing: function() {},
        // throw an error if the 'args' array has fewer than 'expected' elements.
        expectOpts: function(args,expected) {
            if ((args ? args.length : 0) < expected) {
                throw({
                        name: "AssertionError",
                        type: "iq",
                        message: u.format("Expected to receive at least {0} argument",expected.toString())
                    });
            }
        },
        // standardize the format of the output from assertions
        formatAssert: function(message,text,parms) {
            return !text ? '' :
             (message ? message+': ':'')+ parms ?
                u.format(text,u.isArray(parms) ? parms : u.toArray(arguments,2)) :
                '';
        }

    };
    return u;
});
}(typeof define === 'function'
    ? define
    : function (factory) { 
        if (typeof module !== 'undefined') {
            module.exports = factory();
        } else {
            this.common = this.common || {};
            this.common.utils=factory();
        }
    }
    // Boilerplate for AMD, Node, and browser global
));