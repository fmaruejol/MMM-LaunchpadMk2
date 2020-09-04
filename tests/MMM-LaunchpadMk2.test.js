let moduleObject;
const assert = require("assert");
const sinon = require("sinon");
// Create stubs for MM global variables
global.Log = {
  info: sinon.fake(),
  warn: sinon.fake()
};
global.Module = {
  register: function (name, moduleObjectArgument) {
    moduleObject = moduleObjectArgument;
    moduleObject.config = moduleObjectArgument.defaults;
    moduleObject.sendNotification = () => {};
  }
};
global.MM = {
  getModules: () => {
    return {
      withClass: () => {
        return [];
      }
    };
  }
};
// Core module file
require("../MMM-LaunchpadMk2.js");

describe("MMM-LaunchpadMk2", function () {
  describe("#socketNotificationReceived()", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
      sandbox.spy(moduleObject, "sendNotification");
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should dispatch notification when mode is NOTIFICATION", function () {
      moduleObject.mode = "NOTIFICATION";
      moduleObject.socketNotificationReceived("TEST_NOTIFICATION", {});
      assert.strictEqual(
        moduleObject.sendNotification.withArgs("TEST_NOTIFICATION", {})
          .calledOnce,
        true
      );
    });

    it("should dispatch SHOW_ALERT when mode is DESCRIPTION", function () {
      const stub = sinon.stub(global.MM, "getModules").returns({
        withClass: sinon.fake.returns(["alert"])
      });

      moduleObject.mode = "DESCRIPTION";
      moduleObject.socketNotificationReceived("TEST_NOTIFICATION", {});
      assert.strictEqual(
        moduleObject.sendNotification.withArgs("SHOW_ALERT").calledOnce,
        true
      );

      stub.restore();
    });

    it("should do nothing when mode is DESCRIPTION and alert module is not present", function () {
      moduleObject.mode = "DESCRIPTION";
      moduleObject.socketNotificationReceived("TEST_NOTIFICATION", {});
      assert.strictEqual(
        moduleObject.sendNotification.withArgs("SHOW_ALERT").notCalled,
        true
      );
    });
  });
});
