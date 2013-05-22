describe('run/feature/multiPage', function() {
    var uit = uitest.current;
    uit.url("../test/ui/fixtures/multiPage.html");
    uit.feature("multiPage");

    it('should replace the location object by a proxy in argument injection', function() {
        uit.runs(function(window, location, locationProxy) {
            expect(location).toBe(window.locationProxy);
            expect(locationProxy.href).toBe(window.location.href);
            locationProxy.hash = '#someHash';
            expect(window.location.hash).toBe('#someHash');
        });
    });

    it('should replace the location object by a proxy in page scripts', function() {
        uit.runs(function(window, location, locationProxy) {
            expect(window.getLocation() === locationProxy).toBe(true);
        });
    });

    it('should not use the proxy for variables named location in page scripts', function() {
        uit.runs(function(window, location, locationProxy) {
            expect(window.getFakeLocation()).toEqual({
                href: 'someUrl'
            });
        });
    });

    it('should allow reloads using changes to the location via javascript', function() {
        uit.runs(function(window, document, location) {
            window.reloadFlag = true;
            expect(location.href.indexOf('someFlag')).toBe(-1);
            var btn = document.getElementById('refreshByJs');
            btn.click();
        });
        uit.runs(function(window, location, locationProxy) {
            expect(window.reloadFlag).toBeUndefined();
            expect(location.href.indexOf('someFlag') !== -1).toBe(true);
            expect(window.getLocation() === locationProxy).toBe(true);
        });
    });

    it('should allow reloads using clicks on links', function() {
        uit.runs(function(window, document, location) {
            window.reloadFlag = true;
            expect(location.href.indexOf('someFlag')).toBe(-1);
            var btn = document.getElementById('refreshByLink');
            btn.click();
        });
        uit.runs(function(window, location, locationProxy) {
            expect(window.reloadFlag).toBeUndefined();
            expect(location.href.indexOf('someFlag') !== -1).toBe(true);
            expect(window.getLocation() === locationProxy).toBe(true);
        });
    });

    it('should allow reloads using children of links', function() {
        uit.runs(function(window, document, location) {
            window.reloadFlag = true;
            expect(location.href.indexOf('someFlag')).toBe(-1);
            var btn = document.getElementById('refreshByChildOfLink');
            btn.click();
        });
        uit.runs(function(window, location, locationProxy) {
            expect(window.reloadFlag).toBeUndefined();
            expect(location.href.indexOf('someFlag') !== -1).toBe(true);
            expect(window.getLocation() === locationProxy).toBe(true);
        });
    });

    it('should not reload if a link event was prevented', function() {
        uit.runs(function(window, document, location) {
            window.reloadFlag = true;
            var btn = document.getElementById('noRefreshByPreventedLink');
            btn.click();
        });
        uit.runs(function(window, location, locationProxy) {
            expect(window.reloadFlag).toBe(true);
        });
    });

    it('should be able to go back', function() {
        var page1, page2;
        uit.runs(function(window, location) {
            page1 = location.href;
            page2 = location.href.replace('multiPage.html', 'multiPage2.html');
            location.href = page2;
            window.flag1 = true;
        });
        uit.runs(function(window, location, history) {
            expect(location.href).toBe(page2);
            expect(window.flag1).toBeUndefined();
            window.flag2 = true;
            history.back();
        });
        uit.runs(function(window, location, history) {
            expect(location.href).toBe(page1);
            expect(window.flag1).toBeUndefined();
            expect(window.flag2).toBeUndefined();
        });
    });
});