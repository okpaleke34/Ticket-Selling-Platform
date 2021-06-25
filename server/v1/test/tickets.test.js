const chai = require('chai')
const chaiHttp =  require('chai-http')
const server = require('../server')
// Assertion style
chai.should()

chai.use(chaiHttp)
chai.request('http://localhost:4000')

describe('Ticket selling API', ()=>{
    // Test the GET route
    describe('GET /settings/ ',()=>{
        it('It should GET all the settings',(done)=>{
            chai.request(server)
            .get('/api/ticket/settings/')
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.data.should.be.a('object')
                res.body.success.should.be.a('boolean').eq(true)
                done()
            })
        })
    })

    describe('GET /api/ticket/reservation/:token',()=>{
        it('It should GET a particular reservation details using token',(done)=>{
            const token = 'd9b5b465-21d3-4fa9-ba59-61349df2f811'
            chai.request(server)
            .get(`/api/ticket/reservation/${token}`)
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.data.should.be.a('object')
                res.body.success.should.be.a('boolean').eq(true)
                done()
            })
        })
    })


    // Test the POST route
    describe("POST /api/v1/ticket/reserve",()=>{
        it("It should make a reservation",(done)=>{
            const data = {first_name:"John",last_name:"Doe",email:"john@doe.com",no_of_tickets:4}
            chai.request(server)
            .post("/api/v1/ticket/reserve")
            .send(data)
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.data.should.be.a('object')
                res.body.success.should.be.a('boolean').eq(true)
                done()
            })
        })
        .timeout(10000)
    })


    describe("POST /api/v1/ticket/pay",()=>{
        it("It should make payment for a reservation",(done)=>{
            const data = {amount:80,currency:"EUR",reserve_id:11,mode:"Paypal"}
            chai.request(server)
            .post("/api/v1/ticket/pay")
            .send(data) 
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.message.should.be.a('string')
                res.body.success.should.be.a('boolean').eq(true)
                done()
            })
        })
        .timeout(10000)
    })

})