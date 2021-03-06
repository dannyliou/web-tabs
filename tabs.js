;
(function($) {
    Tabs = function($ele, ops) {
        this.ops = $.extend({
            navSelector: '.nav li',
            showName: null,
            activeClass: 'active',
            menuAttr: 'name',
            canToggle:false
        }, ops || {});
        this.$ele = $ele;
        this.tabs = {} //cach tab
        init(this);
        bindSwitchEvent(this);
    }

    function init(owner) {
        var $menus = $(owner.ops.navSelector, owner.$ele),
            menuAttr = owner.ops.menuAttr;
        //init the first showname
        !owner.ops.showName && (owner.ops.showName = $menus.eq(0).attr(menuAttr));
        //show the first show panel and hide others
        $menus.each(function(index, ele) {
            var name = $(this).attr(menuAttr),
                $menu = $(this),
                $panel = $('.' + name, owner.$ele),
                aClass = owner.ops.activeClass,
                showName = owner.ops.showName;
            owner.tabs[name] = new tab($menu, $panel, {
                activeClass: aClass
            });
            if (name === showName) {
                owner.tabs[name].show()
            } else {
                owner.tabs[name].hide()
            }
        });
    }

    function bindSwitchEvent(owner) {
        owner.$ele.on('click', owner.ops.navSelector, function(ev) {
            owner.show($(this).attr(owner.ops.menuAttr));
        })
    }
    Tabs.prototype = {
        show: function(name) {
            var curTab = this.tabs[this.ops.showName];
            if (name === this.ops.showName) {
                if (this.ops.canToggle) {
                    curTab && curTab.hide();
                    this.ops.showName = 'none';
                }
                return;
            };
            curTab && curTab.hide()
            this.$ele.trigger('tabs:hide', [this.ops.showName]);
            this.tabs[name] &&this.tabs[name].show();
            this.$ele.trigger('tabs:show', [this.ops.showName, name]);
            this.ops.showName = name;
        }
    }

    var tab = function($menu, $panel, ops) {
        this.$menu = $menu;
        this.$panel = $panel;
        this.ops = ops;
    }
    tab.prototype = {
        show: function() {
            this.$menu.addClass(this.ops.activeClass);
            (this.$panel.length > 0) && this.$panel.show();
        },
        hide: function() {
            this.$menu.removeClass(this.ops.activeClass);
            (this.$panel.length > 0) && this.$panel.hide();
        }
    }
    $.fn.tabs = function(ops) {
        this.each(function() {
            var tabs = new Tabs($(this), ops);
            // expose the API
            this.getTabsInstance = function() {
                return tabs
            }
        });
    }
})(window.jQuery || window.Zepto)
