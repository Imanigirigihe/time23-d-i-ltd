require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secure_jwt_secret_here';
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Increase file size limit to 50MB
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3|avi|mov|wav/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images, videos, audio, and document files are allowed'));
    }
});

async function initializeDatabase() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS profile (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                bio TEXT,
                email VARCHAR(100) NOT NULL,
                phone1 VARCHAR(20),
                phone2 VARCHAR(20),
                whatsapp VARCHAR(20),
                linkedin VARCHAR(100),
                github VARCHAR(100),
                twitter VARCHAR(100),
                instagram VARCHAR(100),
                registration_number VARCHAR(50),
                degree VARCHAR(100),
                university VARCHAR(100),
                address TEXT
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS education (
                id INT AUTO_INCREMENT PRIMARY KEY,
                level VARCHAR(100) NOT NULL,
                institution VARCHAR(100) NOT NULL,
                period VARCHAR(50) NOT NULL,
                description TEXT
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS skills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                skill VARCHAR(100) NOT NULL,
                category ENUM('Technical', 'Professional', 'Soft') NOT NULL
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS message_replies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message_id INT NOT NULL,
               reply_text TEXT NOT NULL,
                replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(255) NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Check if email column exists, if not add it
        try {
            await connection.query("SELECT email FROM admins LIMIT 1");
        } catch (error) {
            if (error.code === 'ER_BAD_FIELD_ERROR') {
                console.log('Adding email column to admins table');
                await connection.query("ALTER TABLE admins ADD COLUMN email VARCHAR(100)");
            }
        }
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                file_path VARCHAR(255),
                type ENUM('text', 'image', 'video', 'audio', 'file') NOT NULL DEFAULT 'text',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS announcement_comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                announcement_id INT NOT NULL,
                commenter_name VARCHAR(100) NOT NULL,
                comment_text TEXT NOT NULL,
                commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
            )
        `);
        
        // Create comment replies table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS announcement_comment_replies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                comment_id INT NOT NULL,
                replier_name VARCHAR(100) NOT NULL,
                reply_text TEXT NOT NULL,
                replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (comment_id) REFERENCES announcement_comments(id) ON DELETE CASCADE
            )
        `);
        
        const [adminRows] = await connection.query(
            "SELECT * FROM admins WHERE username = 'admin'"
        );
        
        if (adminRows.length === 0) {
            const hashedPassword = await bcrypt.hash('Igirigihe@23', 10);
            await connection.query(
                "INSERT INTO admins (username, password, email) VALUES (?, ?, ?)",
                ['admin', hashedPassword, 'imanigirigiheemmanuel@gmail.com']
            );
            console.log('Admin user created: username=admin, password=Igirigihe@23');
        } else {
            // Update the admin email to the correct one
            await connection.query(
                "UPDATE admins SET email = ? WHERE username = 'admin'",
                ['imanigirigiheemmanuel@gmail.com']
            );
            console.log('Admin email updated to imanigirigiheemmanuel@gmail.com');
        }

        const [profileRows] = await connection.query("SELECT * FROM profile");
        if (profileRows.length === 0) {
            await connection.query(
                "INSERT INTO profile (full_name, bio, email, phone1, phone2, whatsapp, linkedin, github, twitter, instagram, registration_number, degree, university, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    'Imanigirigihe Emmanuel',
                    'I am a passionate and dedicated Business Information Technology student with strong technical skills in web development, database management, and system design. My journey in technology has equipped me with both technical expertise and professional competencies that enable me to deliver effective IT solutions.',
                    'imanigirigiheemmanuel@gmail.com',
                    '+250782529167',
                    '+250721259393',
                    '250782529167',
                    'imanigirigihe',
                    'imanigirigihe',
                    'imanigirigihe',
                    'imanigirigihe',
                    '222011968',
                    'Bachelor of Business Information Technology',
                    'University of Rwanda',
                    'Nkuzuzu cell, Bumbogo sector, Gasabo district, Kigali city, Rwanda'
                ]
            );
        }

        const [eduRows] = await connection.query("SELECT * FROM education");
        if (eduRows.length === 0) {
            await connection.query(
                "INSERT INTO education (level, institution, period, description) VALUES ?",
                [
                    [
                        [
                            "Bachelor of Science in Business Information Technology", 
                            "University of Rwanda", 
                            "2021 - Present", 
                            "Specializing in full-stack web development (React.js, Node.js, Express)\nDatabase design and management with MySQL\nBusiness systems analysis and design\nParticipated in Academic Internship in RP Huye"
                        ],
                        [
                            "Advanced Level Education (A2)", 
                            "G.S. Bumbogo", 
                            "2018 - 2020", 
                            "Combination: History, Economics, Geography\nGraduated with distinction above (75% overall)\nClass representative and student Performer\nOrganized school's first technology club\nWon National Examination"
                        ],
                        [
                            "Ordinary Level Education (O-Level)", 
                            "G.S. Rutunga", 
                            "2014 - 2017", 
                            "Key subjects and activities:\nTop performer in Computer Science and Mathematics\nFounded school's first coding club"
                        ]
                    ]
                ]
            );
        }
        
        const [skillRows] = await connection.query("SELECT * FROM skills");
        if (skillRows.length === 0) {
            await connection.query(
                "INSERT INTO skills (skill, category) VALUES ?",
                [
                    [
                        ["Web development using Node.js and React.js", "Technical"],
                        ["Database design and management (MySQL)", "Technical"],
                        ["Computer troubleshooting and networking basics", "Technical"],
                        ["System design and deployment", "Technical"],
                        ["Microsoft Office tools (Word, Excel, PowerPoint)", "Professional"],
                        ["Data entry and reporting", "Professional"],
                        ["Writing official letters and reports", "Professional"],
                        ["Multimedia and data management", "Professional"],
                        ["IT support and user assistance", "Professional"],
                        ["Leadership and teamwork", "Soft"]
                    ]
                ]
            );
        }
        
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        if (connection) connection.release();
    }
}

initializeDatabase();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

function checkDocumentAccess(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        req.limitedAccess = true;
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.limitedAccess = true;
        } else {
            req.limitedAccess = false;
            req.user = user;
        }
        next();
    });
}

app.get('/api/portfolio', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [profile] = await connection.query("SELECT * FROM profile LIMIT 1");
        const [education] = await connection.query("SELECT * FROM education ORDER BY id DESC");
        const [skills] = await connection.query("SELECT * FROM skills");
        
        res.json({
            profile: profile[0],
            education,
            skills
        });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(
            "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
            [name, email, message]
        );
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/documents', authenticateToken, upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    
    const { documentType } = req.body;
    const { originalname, filename } = req.file;
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(
            "INSERT INTO documents (original_name, file_path, file_type) VALUES (?, ?, ?)",
            [originalname, `/uploads/${filename}`, documentType || 'other']
        );
        
        const [document] = await connection.query(
            "SELECT * FROM documents WHERE id = ?",
            [result.insertId]
        );
        
        res.status(201).json(document[0]);
    } catch (error) {
        console.error('Error uploading document:', error);
        fs.unlinkSync(path.join(UPLOAD_DIR, filename));
        res.status(500).json({ error: 'Failed to upload document' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/documents', checkDocumentAccess, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        if (req.limitedAccess) {
            const [documents] = await connection.query(
                "SELECT id, original_name, file_type, upload_date FROM documents ORDER BY upload_date DESC"
            );
            return res.json(documents);
        }
        
        const [documents] = await connection.query(
            "SELECT id, original_name, file_path, file_type, upload_date FROM documents ORDER BY upload_date DESC"
        );
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            "SELECT * FROM admins WHERE username = ?",
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error during login' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/admin/password-reset', async (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            "SELECT * FROM admins WHERE username = ?",
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No admin found with that username' });
        }
        
        const admin = rows[0];
        
        // Log the reset request for verification
        console.log(`Password reset requested for admin: ${username}. Email would be sent to: ${admin.email}`);
        
        res.json({ 
            message: `Password reset instructions would be sent to ${admin.email}`,
            username: username
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'Server error during password reset' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [messages] = await connection.query(
            "SELECT * FROM messages ORDER BY received_at DESC"
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    } finally {
        if (connection) connection.release();
    }
});

// New endpoint for message statistics
app.get('/api/admin/messages/stats', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Get message counts by date for the last 30 days
        const [stats] = await connection.query(`
            SELECT DATE(received_at) as date, COUNT(*) as count 
            FROM messages 
            WHERE received_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(received_at) 
            ORDER BY date
        `);
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching message stats:', error);
        res.status(500).json({ error: 'Failed to fetch message statistics' });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/api/admin/messages/:id', authenticateToken, async (req, res) => {
    const messageId = req.params.id;
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            "DELETE FROM messages WHERE id = ?",
            [messageId]
        );
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/admin/messages/:id/replies', authenticateToken, async (req, res) => {
    const message_id = req.params.id;
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [replies] = await connection.query(
            "SELECT * FROM message_replies WHERE message_id = ? ORDER BY replied_at DESC",
            [message_id]
        );
        res.json(replies);
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ error: 'Failed to fetch replies' });
    } finally {
       if (connection) connection.release();
    }
});

app.post('/api/admin/messages/:id/reply', authenticateToken, async (req, res) => {
    const { reply_text } = req.body;
    const message_id = req.params.id;
    
    if (!reply_text) {
        return res.status(400).json({ error: 'Reply text is required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO message_replies (message極_id, reply_text) VALUES (?, ?)",
            [message_id, reply_text]
        );
        res.status(201).json({ message: 'Reply sent successfully!' });
    } catch (error) {
        console.error('Error saving reply:', error);
        res.status(500).json({ error: 'Failed to send reply' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/admin/documents', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [documents] = await connection.query(
            "SELECT * FROM documents ORDER BY upload_date DESC"
        );
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/admin/documents', authenticateToken, upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    
    const { documentType } = req.body;
    const { originalname, filename } = req.file;
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(
            "INSERT INTO documents (original_name, file_path, file_type) VALUES (?, ?, ?)",
            [originalname, `/uploads/${filename}`, documentType || 'other']
        );
        
        const [document] = await connection.query(
            "SELECT * FROM documents WHERE id = ?",
            [result.insertId]
        );
        
        res.status(201).json(document[0]);
    } catch (error) {
        console.error('Error uploading document:', error);
        fs.unlinkSync(path.join(UPLOAD_DIR, filename));
        res.status(500).json({ error: 'Failed to upload document' });
    } finally {
        if (connection) connection.release();
    }
});

app.put('/api/admin/documents/:id', authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const { file_type } = req.body;
    
    if (!file_type) {
        return res.status(400).json({ error: 'File type is required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            "UPDATE documents SET file_type = ? WHERE id = ?",
            [file_type, documentId]
        );
        
        const [document] = await connection.query(
            "SELECT * FROM documents WHERE id = ?",
            [documentId]
        );
        
        res.json(document[0]);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Failed to update document' });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/api/admin/documents/:id', authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    
    let connection;
    try {
        connection = await pool.getConnection();
        const [documents] = await connection.query(
            "SELECT file_path FROM documents WHERE id = ?",
            [documentId]
        );
        
        if (documents.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        const filePath = path.join(__dirname, documents[0].file_path);
        await connection.query(
            "DELETE FROM documents WHERE id = ?",
            [documentId]
        );
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/announcements', async (req, res) => {
    try {
        const [announcements] = await pool.query(
            "SELECT * FROM announcements ORDER BY created_at DESC"
        );
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

app.get('/api/admin/announcements', authenticateToken, async (req, res) => {
    try {
        const [announcements] = await pool.query(
            "SELECT * FROM announcements ORDER BY created_at DESC"
        );
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

app.post('/api/admin/announcements', authenticateToken, upload.single('file'), async (req, res) => {
    const { title, content, type } = req.body;
    const file = req.file;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
       const filePath = file ? `/uploads/${file.filename}` : null;
        
        const [result] = await connection.query(
            "INSERT INTO announcements (title, content, file_path, type) VALUES (?, ?, ?, ?)",
            [title, content, filePath, type || 'text']
        );
        
        const [announcement] = await connection.query(
            "SELECT * FROM announcements WHERE id = ?",
            [result.insertId]
        );
        
        res.status極(201).json(announcement[0]);
    } catch (error) {
        console.error('Error creating announcement:', error);
        if (file) {
            fs.unlinkSync(path.join(UPLOAD_DIR, file.filename));
        }
        res.status(500).json({ error: 'Failed to create announcement' });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/api/admin/announcements/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [ann] = await connection.query(
            "SELECT file_path FROM announcements WHERE id = ?", 
            [id]
        );
        
        if (ann.length > 0 && ann[0].file_path) {
            const filePath = path.join(__dirname, ann[0].file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await connection.query(
            "DELETE FROM announcements WHERE id = ?", 
            [id]
        );
        
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/announcements/:id/comments', async (req, res) => {
    const announcementId = req.params.id;
    
    try {
        const [comments] = await pool.query(
            "SELECT * FROM announcement_comments WHERE announcement_id = ? ORDER BY commented_at DESC",
            [announcementId]
        );
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

app.post('/api/announcements/:id/comments', async (req, res) => {
    const announcementId = req.params.id;
    const { commenter_name, comment_text } = req.body;
    
    if (!commenter_name || !comment_text) {
        return res.status(400).json({ error: 'Name and comment are required' });
    }
    
    try {
        const [result] = await pool.query(
            "INSERT INTO announcement_comments (announcement_id, commenter_name, comment_text) VALUES (?, ?, ?)",
            [announcementId, commenter_name, comment_text]
        );
        
        const [comment] = await pool.query(
            "SELECT * FROM announcement_comments WHERE id = ?",
            [result.insertId]
        );
        
        res.status(201).json(comment[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

app.delete('/api/admin/announcements/comments/:id', authenticateToken, async (req, res) => {
    const commentId = req.params.id;
    
    try {
        await pool.query(
            "DELETE FROM announcement_comments WHERE id = ?",
            [commentId]
        );
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

app.get('/api/comments/:commentId/replies', async (req, res) => {
    const commentId = req.params.commentId;
    
    try {
        const [replies] = await pool.query(
            "SELECT * FROM announcement_comment_replies WHERE comment_id = ? ORDER BY replied_at DESC",
            [commentId]
        );
        res.json(replies);
    } catch (error) {
        res.status(500).json({ error: '極Failed to fetch comment replies' });
    }
});

app.post('/api/comments/:commentId/replies', async (req, res) => {
    const commentId = req.params.commentId;
    const { replier_name, reply_text } = req.body;
    
    if (!replier_name || !reply_text) {
        return res.status(400).json({ error: 'Name and reply text are required' });
    }
    
    try {
        const [result] = await pool.query(
            "INSERT INTO announcement_comment_replies (comment_id, replier_name, reply_text) VALUES (?, ?, ?)",
            [commentId, replier_name, reply_text]
        );
        
        const [reply] = await pool.query(
            "SELECT * FROM announcement_comment_replies WHERE id = ?",
            [result.insertId]
        );
        
        res.status(201).json(reply[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add reply' });
    }
});

app.delete('/api/admin/comments/replies/:replyId', authenticateToken, async (req, res) => {
    const replyId = req.params.replyId;
    
    try {
        await pool.query(
            "DELETE FROM announcement_comment_replies WHERE id = ?",
            [replyId]
        );
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reply' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message || 'Something went wrong!' });
    }
    
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});