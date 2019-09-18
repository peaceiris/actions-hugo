const getOS = require("../lib/get-os");

describe("getOS", () => {
  test("test", () => {
    expect(getOS("linux")).toBe("Linux");
    expect(getOS("darwin")).toBe("macOS");
    expect(getOS("win32")).toBe("Windows");
  });

  test("test exception", () => {
    // expect(() => {
    //   getOS("win32");
    // }).toThrowError("Windows is not supported");
    expect(() => {
      getOS("centos");
    }).toThrowError("centos is not supported");
  });
});
