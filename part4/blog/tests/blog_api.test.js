const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')

const testBlogs = require('./test_blogs')
const initialBlogs = testBlogs.blogs

beforeAll(async () => {
    await Blog.remove({})

    let blogObj 
    for (let i = 0; i < initialBlogs.length; i++) {
        blogObj = new Blog(initialBlogs[i])
        await blogObj.save()
    }
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(initialBlogs.length)
})

test('blog is added', async () => {
    await api.post('/api/blogs')
    .send(testBlogs.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(contents).toContain(testBlogs.newBlog.title)
})

afterAll(() => {
    server.close()
})