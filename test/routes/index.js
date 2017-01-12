describe("Routes: Index", () => {
    describe("GET /", () => {
        it("returns the API status", done => {
            request.get("/")
            .expect(200)
            .end((err, res) => {
                const expected =  {
                    'api': 'Node-Starter',
                    'status': 'OK'
                }

                expect(res.body).to.eql(expected);
                done(err);
            });
        });
    });
});
