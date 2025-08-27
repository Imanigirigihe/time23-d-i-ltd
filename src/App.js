import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import profileImage from './assets/profile.jpg.jpg';

// Add Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

const AuthContext = createContext({
  token: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {}
});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setIsAdmin(decoded.username === 'admin');
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setIsAdmin(false);
        }
    }, [token]);
    
    const login = async (username, password) => {
        try {
            const { data } = await axios.post('/api/admin/login', { username, password });
            setToken(data.token);
            return data.token;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };
    
    const logout = () => {
        setToken(null);
    };
    
    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

function jwtDecode(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const Header = ({ currentPage, setCurrentPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { token } = useContext(AuthContext);
    const pages = ['home', 'about', 'skills', 'education', 'documents', 'announcements', 'contact'];
    
    return (
        <header>
            <div className="container">
                <nav>
                    <div className="logo">Imanigirigihe Emmanuel</div>
                    <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
                        {pages.map(page => (
                            <li key={page}>
                                <button 
                                    onClick={() => { setCurrentPage(page); setMenuOpen(false); }} 
                                    className={currentPage === page ? 'active' : ''}
                                >
                                    {page.charAt(0).toUpperCase() + page.slice(1)}
                                </button>
                            </li>
                        ))}
                        {token && (
                            <li><Link to="/admin/dashboard" className="admin-link">Admin Dashboard</Link></li>
                        )}
                    </ul>
                    <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
                </nav>
            </div>
        </header>
    );
};

const Home = ({ profile, setCurrentPage }) => {
    // Add loading state for profile
    if (!profile) {
        return (
            <section className="section home-section" id="home">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading profile data...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="section home-section" id="home">
            {/* Sunrise animation elements */}
            <div className="sun-animation">
                <div className="sun"></div>
                <div className="sun-rays"></div>
                <div className="ray ray-1"></div>
                <div className="ray ray-2"></div>
                <div className="ray ray-3"></div>
                <div className="ray ray-4"></div>
                <div className="ray ray-5"></div>
                <div className="ray ray-6"></div>
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="cloud cloud-4"></div>
            </div>
            
            <div className="container">
                <div className="home-content">
                    <div className="home-intro">
                        <h2>Welcome to My Portfolio</h2>
                        <p className="home-subtitle">Business Information Technology Professional</p>
                        <p className="home-description">
                            I'm a passionate software developer with expertise in full-stack web development, 
                            database management, and creating innovative IT solutions. Explore my portfolio to 
                            learn more about my skills, experience, and projects.
                        </p>
                        <div className="home-cta">
                            <button onClick={() => setCurrentPage('about')} className="btn btn-primary">
                                Learn More About Me
                            </button>
                            <button onClick={() => setCurrentPage('contact')} className="btn btn-secondary">
                                Get In Touch
                            </button>
                        </div>
                    </div>
                    <div className="home-image">
                        <img src={profileImage} alt={profile.full_name} className="home-profile-image" />
                    </div>
                </div>
                
                <div className="home-highlights">
                    <div className="highlight-card">
                        <div className="highlight-icon">💻</div>
                        <h3>Web Development</h3>
                        <p>Full-stack development with React.js and Node.js</p>
                    </div>
                    <div className="highlight-card">
                        <div className="highlight-icon">📊</div>
                        <h3>Database Management</h3>
                        <p>MySQL database design and optimization</p>
                    </div>
                    <div className="highlight-card">
                        <div className="highlight-icon">🛠️</div>
                        <h3>IT Solutions</h3>
                        <p>Business-focused technology solutions</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const About = ({ profile, setCurrentPage }) => {
    // Add loading state for profile
    if (!profile) {
        return (
            <section className="section" id="about">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading profile data...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="section" id="about">
            <div className="container">
                <div className="section-title"><h2>About Me</h2><p className="section-subtitle">Get to know me better</p></div>
                <div className="about-content">
                    <div className="about-image-container"><img src={profileImage} alt={profile.full_name} className="about-image" /></div>
                    <div className="about-text">
                        <h3>{profile.full_name}</h3>
                        <div className="bio-section">
                            <h4>Introduction</h4>
                            <p className="bio">
                                I am a passionate and dedicated Business Information Technology student with strong technical 
                                skills in web development, database management, and system design. My journey in technology 
                                has equipped me with both technical expertise and professional competencies that enable me 
                                to deliver effective IT solutions.
                            </p>
                        </div>
                        <div className="goals-section">
                            <h4>My Objectives</h4>
                            <ul className="goals-list">
                                <li>To leverage my technical skills in web development and database management to build efficient systems</li>
                                <li>To apply my problem-solving abilities in real-world IT challenges</li>
                                <li>To continuously learn and adapt to emerging technologies</li>
                                <li>To contribute to organizational success through innovative IT solutions</li>
                                <li>To develop leadership skills while working in team environments</li>
                            </ul>
                        </div>
                        <div className="contact-info">
                            <div className="contact-item"><span><i className="icon email-icon"></i> imanigirigiheemmanuel@gmail.com</span></div>
                            <div className="contact-item"><span><i className="icon phone-icon"></i> +250782529167 / +250721259393</span></div>
                            <div className="contact-item"><a href="https://wa.me/250782529167" target="_blank" rel="noopener noreferrer"><i className="icon whatsapp-icon"></i> WhatsApp: +250782529167</a></div>
                            <div className="contact-item"><a href="https://linkedin.com/in/imanigirigihe" target="_blank" rel="noopener noreferrer"><i className="icon linkedin-icon"></i> LinkedIn: imanigirigihe Emmanuel</a></div>
                            <div className="contact-item"><a href="https://instagram.com/imanigirigihe" target="_blank" rel="noopener noreferrer"><i className="icon instagram-icon"></i> Instagram: @imanigirigihe</a></div>
                            <div className="contact-item"><a href="https://twitter.com/imanigirigihe" target="_blank" rel="noopener noreferrer"><i className="icon twitter-icon"></i> Twitter: @imanigirigihe</a></div>
                            <div className="contact極-item"><span><i className="icon id-icon"></i> Reg No: 222011968</span></div>
                            <div className="contact-item"><span><i className="icon degree-icon"></i> Degree: Bachelor of Business Information Technology</span></div>
                            <div className="contact-item"><span><i className="icon university-icon"></i> University: University of Rwanda</span></div>
                            <div className="contact-item">
                                <span><i className="icon location-icon"></i> Location: Nkuzuzu cell, Bumbogo sector, Gasabo district, Kigali city, Rwanda</span>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.490955716618!2d30.06158231475389!3d-1.954398998572303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTcnMT5uOCJTIDMwwrAwMyc0OS4xIkU!5e0!3m2!1sen!2srw!4v1620000000000!5m2!1sen!2srw"
                                        width="100%"
                                        height="200"
                                        style={{border:0}}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="My Location"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setCurrentPage('documents')} className="btn btn-download">View Documents <i className="icon document-icon"></i></button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Skills = ({ skills }) => {
    // Add loading state for skills
    if (!skills) {
        return (
            <section className="section" id="skills">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading skills data...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    const updatedSkills = [
        { id: 1, skill: "Web development using Node.js and React.js", category: "Technical" },
        { id: 2, skill: "Database design and management (MySQL)", category: "Technical" },
        { id: 3, skill: "Computer troubleshooting and networking basics", category: "Technical" },
        { id: 4, skill: "Microsoft Office tools (Word, Excel, PowerPoint)", category: "Professional" },
        { id: 5, skill: "Data entry and reporting", category: "Professional" },
         { id: 6, skill: "Writing official letters and reports", category: "Professional" },
        { id: 7, skill: "Multimedia and data management", category: "Professional" },
        { id: 8, skill: "Leadership", category: "Soft" },
        { id: 9, skill: "Teamwork", category: "Soft" },
        { id: 10, skill: "Solving problem", category: "Soft" },
        { id: 11, skill: "System design and deployment", category: "Technical" },
        { id: 12, skill: "IT support and user assistance", category: "Professional" }
    ];

    const skillCategories = updatedSkills.reduce((acc, skill) => {
        (acc[skill.category] = acc[skill.category] || []).push(skill);
        return acc;
    }, {});
    
    const categoryIcons = { 'Technical': '💻', 'Professional': '📊', 'Soft': '👥' };
    
    return (
        <section className="section" id="skills">
            <div className="container">
                <div className="section-title"><h2>Skills & Responsibilities</h2><p className="section-subtitle">What I bring to the table</p></div>
                <div className="skills-container">
                    {Object.entries(skillCategories).map(([category, skills]) => (
                        <div className="skill-category" key={category}>
                            <h3>{categoryIcons[category]} {category} Skills</h3>
                            <ul>{skills.map(skill => <li className="skill-item" key={skill.id}><span className="skill-bullet">•</span> {skill.skill}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Education = ({ education }) => {
    // Add loading state for education
    if (!education) {
        return (
            <section className="section" id="education">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading education data...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="section" id="education">
            <div className="container">
                <div className="section-title">
                    <h2>Academic Journey</h2>
                    <p className="section-subtitle">My educational background and achievements</p>
                </div>
                <div className="timeline">
                    <div className="timeline-item left">
                        <div className="timeline-content">
                            <h3>🎓 Bachelor of Science in Business Information Technology</h3>
                            <p><strong>University of Rwanda</strong> | <em>2021 - Present</em></p>
                            <div className="education-details">
                                <p>Key coursework and accomplishments:</p>
                                <ul>
                                    <li>Specializing in full-stack web development (React.js, Node.js, Express)</li>
                                    <li>Database design and management with MySQL</li>
                                    <li>Business systems analysis and design</li>
                                    <li>Participated in Academic Internship in RP Huye</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="timeline-item right">
                        <div className="極timeline-content">
                            <h3>📚 Advanced Level Education (A2)</h3>
                            <p><strong>G.S. Bumbogo</strong> | <em>2018 - 2020</em></p>
                            <div className="education-details">
                                <p>Combination: History, Economics, Geography</p>
                                <ul>
                                    <li>Graduated with distinction above (75% overall)</li>
                                    <li>Class representative and student Performer</li>
                                    <li>Organized school's first technology club</li>
                                    <li>Won National Examinational</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Fixed the class name and closing tag below */}
                    <div className="timeline-item left">
                        <div className="timeline-content">
                            <h3>📖 Ordinary Level Education (O-Level)</h3>
                            <p><strong>G.S. Rutunga</strong> | <em>2014 - 2017</em></p>
                            <div className="education-details">
                                <p>Key subjects and activities:</p>
                                <ul>
                                    <li>Top performer in Computer Science and Mathematics</li>
                                    <li>Founded school's first coding club</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Documents = () => {
    const { isAdmin, token } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('certificate');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const fetchDocuments = async () => {
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const { data } = await axios.get('/api/documents', config);
            setDocuments(data);
        } catch (err) { 
            console.error("Failed to fetch documents", err);
            setError('Failed to load documents');
        }
    };
    
    useEffect(() => { fetchDocuments(); }, [token]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }
        
        setUploading(true);
        setError('');
        setSuccess('');
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        
        try {
            await axios.post('/api/documents', formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                } 
            });
            setSuccess('Document uploaded successfully!');
            setFile(null);
            fetchDocuments();
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <section className="section" id="documents">
            <div className="container">
                <div className="section-title">
                    <h2>Professional Documentation</h2>
                    <p className="section-subtitle">Verified credentials and supporting materials</p>
                </div>
                
                <div className="documents-intro">
                    <p>
                        This portfolio contains my official academic records, professional certifications, 
                        and project documentation. All files have been authenticated and are available 
                        for your review.
                    </p>
                    {!isAdmin && (
                        <div className="document-access-warning">
                            <p>Please contact me for access to these documents or login as admin to view.</p>
                        </div>
                    )}
                    {isAdmin && (
                        <p>
                            Authorized administrators may upload additional documents that will be verified 
                            and added to my professional portfolio.
                        </p>
                    )}
                </div>

                {isAdmin && (
                    <div className="upload-section">
                        <h3>Document Upload Portal</h3>
                        <div className="upload-description">
                            <p>Accepted document types include:</p>
                            <ul>
                                <li>Academic transcripts and diplomas</li>
                                <li>Professional certifications and licenses</li>
                                <li>Project portfolios and case studies</li>
                                <li>Letters of recommendation</li>
                            </ul>
                            <p>Maximum file size: <strong>50MB</strong> (PDF, DOC, JPG, PNG formats)</p>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label>Document Category</label>
                                <select 
                                    value={documentType} 
                                    onChange={e => setDocumentType(e.target.value)} 
                                    required
                                >
                                    <option value="certificate">Academic Certificate</option>
                                    <option value="transcript">Academic Transcript</option>
                                    <option value="certification">Professional Certification</option>
                                    <option value="portfolio">Project Portfolio</option>
                                    <option value="other">Other Document</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select File</label>
                                <input 
                                    type="file" 
                                    onChange={e => setFile(e.target.files[0])} 
                                    required 
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </div>
{error && <div className="alert alert-error">{error}</div>}
{success && <div className="alert alert-success">{success}</div>}
<button type="submit" className="btn" disabled={uploading}>
    {uploading ? 'Uploading...' : 'Upload Document'}
</button>
</form>
</div>
)}

                <div className="documents-list">
                    <div className="list-header">
                        <h3>Verified Documents Collection</h3>
                        <p>
                            Below are my authenticated documents organized by category and upload date:
                        </p>
                    </div>
                    {documents.length === 0 ? (
                        <p className="no-documents">No documents have been uploaded yet</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="documents-table">
                                <thead>
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Category</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map(doc => (
                                        <tr key={doc.id}>
                                            <td>{doc.original_name}</td>
                                            <td className={`doc-type ${doc.file_type.toLowerCase()}`}>
                                                {doc.file_type}
                                            </td>
                                            <td>{new Date(doc.upload_date).toLocaleDateString()}</td>
                                            <td>
                                                {isAdmin ? (
                                                    <a 
                                                        href={`${API_URL}${doc.file_path}`} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="btn-preview"
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    <button 
                                                        className="btn-preview" 
                                                        onClick={() => alert('Please login as admin to view this document')}
                                                    >
                                                        Request Access
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="document-guidelines">
                    <h4>Document Verification Process</h4>
                    <div className="guidelines-content">
                        <div className="guideline">
                            <div className="guideline-icon">🔍</div>
                            <p>All documents are manually reviewed for authenticity</p>
                        </div>
                        <div className="guideline">
                            <div className="guideline-icon">🛡️</div>
                            <p>Files are stored securely with restricted access</p>
                        </div>
                        <div className="guideline">
                            <div className="guideline-icon">⏱</div>
                            <p>New uploads are typically verified within 48 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CommentReplies = ({ commentId }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newReply, setNewReply] = useState('');
    const [error, setError] = useState('');
    const { isAdmin } = useContext(AuthContext);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    
    const fetchReplies = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/comments/${commentId}/replies`);
            setReplies(data);
        } catch (err) {
            console.error("Failed to fetch replies", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (showReplies) {
            fetchReplies();
        }
    }, [showReplies, commentId]);

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!newReply.trim()) {
            setError('Reply text is required');
            return;
        }
        
        try {
            const { data } = await axios.post(`/api/comments/${commentId}/replies`, {
                reply_text: newReply,
                replier_name: 'Admin'
            });
            setReplies([data, ...replies]);
            setNewReply('');
            setError('');
            setShowReplyForm(false);
        } catch (err) {
            setError('Failed to add reply. Please try again.');
        }
    };

    return (
        <div className="replies-section">
            <button 
                className="btn btn-replies-toggle"
                onClick={() => setShowReplies(!showReplies)}
            >
                {showReplies ? 'Hide Replies' : `Show Replies (${replies.length})`}
            </button>
            
            {showReplies && (
                <div className="replies-container">
                    {loading ? (
                        <div className="loading-replies">Loading replies...</div>
                    ) : (
                        <>
                            {replies.length > 0 ? (
                                <ul className="replies-list">
                                    {replies.map(reply => (
                                        <li key={reply.id} className="reply-item">
                                            <div className="reply-header">
                                                <strong>{reply.replier_name}</strong>
                                                <span>{new Date(reply.replied_at).toLocaleString()}</span>
                                            </div>
                                            <p className="reply-text">{reply.reply_text}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-replies">No replies yet</p>
                            )}
                            
                            {isAdmin && (
                                <div className="admin-reply-section">
                                    {showReplyForm ? (
                                        <form onSubmit={handleSubmitReply} className="reply-form">
                                            <div className="form-group">
                                                <textarea
                                                    value={newReply}
                                                    onChange={e => setNewReply(e.target.value)}
                                                    placeholder="Your reply..."
                                                    rows="3"
                                                    required
                                                ></textarea>
                                            </div>
                                            {error && <div className="alert alert-error">{error}</div>}
                                            <div className="form-actions">
                                                <button type="submit" className="btn">Post Reply</button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-clear"
                                                    onClick={() => setShowReplyForm(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button 
                                            className="btn btn-add-reply"
                                            onClick={() => setShowReplyForm(true)}
                                        >
                                            Add Reply
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const AnnouncementComments = ({ announcementId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({ name: '', text: '' });
    const [error, setError] = useState('');
    const [showComments, setShowComments] = useState(false);
    const { isAdmin } = useContext(AuthContext);
    
    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`/api/announcements/${announcementId}/comments`);
            setComments(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch comments", err);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments, announcementId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.text.trim()) {
            setError('Both fields are required');
            return;
        }
        
        try {
            const { data } = await axios.post(`/api/announcements/${announcementId}/comments`, {
                commenter_name: newComment.name,
                comment_text: newComment.text
            });
            setComments([data, ...comments]);
            setNewComment({ name: '', text: '' });
            setError('');
        } catch (err) {
            setError('Failed to add comment. Please try again.');
        }
    };

    return (
        <div className="comments-section">
            <button 
                className="btn btn-comments-toggle"
                onClick={() => setShowComments(!showComments)}
            >
                {showComments ? 'Hide Comments' : 'Show Comments'} ({comments.length})
            </button>
            
            {showComments && (
                <div className="comments-container">
                    {loading ? (
                        <div className="loading-comments">Loading comments...</div>
                    ) : (
                        <>
                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-header">
                                                <strong>{comment.commenter_name}</strong>
                                                <span>{new Date(comment.commented_at).toLocaleString()}</span>
                                            </div>
                                            <p className="comment-text">{comment.comment_text}</p>
                                            
                                            <CommentReplies commentId={comment.id} />
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <form onSubmit={handleSubmit} className="comment-form">
                                <h4>Add a Comment</h4>
                                {error && <div className="alert alert-error">{error}</div>}
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        value={newComment.name}
                                        onChange={e => setNewComment({...newComment, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        placeholder="Your Comment" 
                                        value={newComment.text}
                                        onChange={e => setNewComment({...newComment, text: e.target.value})}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn">Post Comment</button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await axios.get('/api/announcements');
                setAnnouncements(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch announcements", err);
                setLoading(false);
            }
        };
        
        fetchAnnouncements();
    }, []);

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading announcements...</p></div>;
    
    return (
        <section className="section announcements-section" id="announcements">
            <div className="container">
                <div className="section-title">
                    <h2>Announcements</h2>
                    <p className="section-subtitle">Latest updates and news</p>
                </div>
                
                {announcements.length === 0 ? (
                    <div className="no-announcements">
                        <div className="no-announcements-icon">📢</div>
                        <h3>No Announcements Yet</h3>
                        <p>Check back later for updates and news.</p>
                    </div>
                ) : (
                    <div className="announcements-grid">
                        {announcements.map(ann => (
                            <div key={ann.id} className="announcement-card">
                                <div className="announcement-header">
                                    <h3>{ann.title}</h3>
                                    <span className="announcement-date">
                                        {new Date(ann.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="announcement-content">
                                    <p>{ann.content}</p>
                                    {ann.file_path && (
                                        <div className="announcement-attachment">
                                            {ann.type === 'image' ? (
                                                <div className="announcement-image-container">
                                                    <img 
                                                        src={`${API_URL}${ann.file_path}`} 
                                                        alt={ann.title} 
                                                        className="announcement-image"
                                                    />
                                                </div>
                                            ) : (
                                                <a 
                                                    href={`${API_URL}${ann.file_path}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn-download"
                                                >
                                                    <span className="attachment-icon"></span>
                                                    Download Attachment
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="announcement-footer">
                                    <AnnouncementComments announcementId={ann.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const Contact = ({ profile }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        try {
            await axios.post('/api/messages', formData);
            setSubmitMessage('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setSubmitMessage('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="section" id="contact">
            <div className="container">
                <div className="section-title">
                    <h2>Professional Contact</h2>
                    <p className="section-subtitle">Get in touch for opportunities and collaborations</p>
                </div>

                <div className="contact-intro">
                    <p>
                        I welcome inquiries regarding employment opportunities, project collaborations, 
                        or professional networking. Please use the most appropriate contact method 
                        for your needs.
                    </p>
                </div>

                <div className="contact-container">
                    <div className="contact-info-box">
                        <h3>Direct Contact Channels</h3>
                        
                        <div className="contact-method">
                            <div className="method-header">
                                <i className="icon email-icon"></i>
                                <h4>Email Communication</h4>
                            </div>
                            <a href="mailto:imanigirigiheemmanuel@gmail.com" className="contact-detail">
                                imanigirigiheemmanuel@gmail.com
                            </a>
                            <p className="method-description">
                                Best for formal inquiries, document submissions, and detailed proposals.
                                Typically respond within 24 hours on business days.
                            </p>
                        </div>

                        <div className="contact-method">
                            <div className="method-header">
                                <i className="icon phone-icon"></i>
                                <h4>Phone Contact</h4>
                            </div>
                            <div className="contact-detail">
                                +250782529167 (Primary)
                            </div>
                            <div className="contact-detail">
                                +250721259393 (Secondary)
                            </div>
                            <p className="method-description">
                                Available for calls Monday-Friday, 9:00 AM to 5:00 PM local time.
                                Please text first if calling outside business hours.
                            </p>
                        </div>

                        <div className="contact-method">
                            <div className="method-header">
                                <i className="icon whatsapp-icon"></i>
                                <h4>Instant Messaging</h4>
                            </div>
                            <a 
                                href="https://wa.me/250782529167" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="contact-detail"
                            >
                                WhatsApp: +250782529167
                            </a>
                            <p className="method-description">
                                Preferred for quick questions, meeting coordination, and informal communication.
                                Read receipts enabled.
                            </p>
                        </div>

                        <div className="business-hours">
                            <h4>Standard Availability</h4>
                            <ul>
                                <li><strong>Monday-Friday:</strong> 9:00 AM - 5:00 PM</li>
                                <li><strong>Weekends:</strong> By appointment only</li>
                                <li><strong>Holidays:</strong> Limited availability</li>
                            </ul>
                            <p>
                                For urgent matters outside these hours, please begin your message with "URGENT".
                            </p>
                        </div>
                    </div>

                    <div className="contact-form">
                        <h3>Send a Formal Message</h3>
                        <div className="form-description">
                            <p>
                                For detailed inquiries, project proposals, or official communications, 
                                please complete this form with all relevant information.
                            </p>
                            <p>
                                All fields are required to ensure proper handling of your request.
                            </p>
                        </div>
                        
                        {submitMessage && (
                            <div className={`alert ${submitMessage.includes('Failed') ? 'alert-error' : 'alert-success'}`}>
                                {submitMessage}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required
                                    placeholder="First and Last Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Email Address</label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    required
                                    placeholder="example@domain.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Message</label>
                                <textarea 
                                    value={formData.message} 
                                    onChange={e => setFormData({...formData, message: e.target.value})} 
                                    required
                                    rows="6"
                                    placeholder="Please include all relevant details about your inquiry..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending Message...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="professional-networks">
                    <h3>Connect on Professional Platforms</h3>
                    <div className="network-buttons">
                        <a 
                            href="https://linkedin.com/in/imanigirigihe" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-linkedin"
                        >
                            <i className="icon linkedin-icon"></i> LinkedIn Profile
                        </a>
                        <a 
                            href="https://github.com/imanigirigihe" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-github"
                        >
                            <i className="icon github-icon"></i> GitHub Portfolio
                        </a>
                        <a 
                            href="https://twitter.com/imanigirigihe" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-twitter"
                        >
                            <i className="icon twitter-icon"></i> Twitter Updates
                        </a>
                    </div>
                    <p className="network-description">
                        Connect with me on professional networks to view my latest projects, 
                        publications, and professional activities.
                    </p>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const { token } = useContext(AuthContext);
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-about">
                        <h3>About</h3>
                        <p>Business Information Technology student with a passion for web development and data analysis.</p>
                    </div>
                    </div>
                    <div className="footer-social">
                        <h3>Connect</h3>
                        <div className="social-links">
                            <a href="https://instagram.com/imanigirigihe" target="_blank" rel="noopener noreferrer">
                                <i className="icon instagram-icon"></i> Instagram
                            </a>
                            <a href="https://twitter.com/imanigirigihe" target="_blank" rel="noopener noreferrer">
                                <i className="icon twitter-icon"></i> Twitter
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Imanigirigihe Emmanuel. All rights reserved. {!token && <Link to="/admin/login">Login</Link>}</p>
                </div>
        </footer>
    );
};

const AdminLogin = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('Igirigihe@23');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid username or password');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/admin/password-reset', { username });
            setError(response.data.message);
            setIsResetMode(false);
        } catch (err) {
            console.error('Reset error:', err);
            setError(err.response?.data?.error || 'Failed to send reset instructions');
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={isResetMode ? handleResetPassword : handleSubmit} className="admin-login-form">
                <h2>Admin Panel {isResetMode ? 'Reset Password' : 'Login'}</h2>
                {error && <div className="alert alert-error">{error}</div>}
                
                {isResetMode ? (
                    <div className="form-group">
                        <label>Admin Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={e => setUsername(e.target.value)} 
                            required
                            placeholder="Enter your admin username"
                        />
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="show-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
                <button type="submit" className="btn">
                    {isResetMode ? 'Send Reset Instructions' : 'Login'}
                </button>
                <button 
                    type="button" 
                    className="btn btn-clear"
                    onClick={() => setIsResetMode(!isResetMode)}
                >
                    {isResetMode ? 'Back to Login' : 'Forgot Password?'}
                </button>
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                >
                    Back to Homepage
                </button>
            </form>
        </div>
    );
};

const AdminSidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>Admin Panel</h3>
                <p>Imanigirigihe Emmanuel</p>
            </div>
            <div className="admin-profile">
                <img src={profileImage} alt="Admin" />
                <p>Admin User</p>
            </div>
            <ul className="admin-menu">
                <li>
                    <a 
                        href="#!" 
                        className={activeMenu === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveMenu('dashboard')}
                    >
                        <span className="menu-icon">📊</span>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a 
                        href="#!" 
                        className={activeMenu === 'messages' ? 'active' : ''}
                        onClick={() => setActiveMenu('messages')}
                    >
                        <span className="menu-icon">✉️</span>
                        Messages
                    </a>
                </li>
                <li>
                    <a 
                        href="#!" 
                        className={activeMenu === 'documents' ? 'active' : ''}
                        onClick={() => setActiveMenu('documents')}
                    >
                        <span className="menu-icon">📁</span>
                        Documents
                    </a>
                </li>
                <li>
                    <a 
                        href="#!" 
                        className={activeMenu === 'announcements' ? 'active' : ''}
                        onClick={() => setActiveMenu('announcements')}
                    >
                        <span className="menu-icon">📢</span>
                        Announcements
                    </a>
                </li>
                <li>
                    <a 
                        href="#!" 
                        className={activeMenu === 'settings' ? 'active' : ''}
                        onClick={() => setActiveMenu('settings')}
                    >
                        <span className="menu-icon">⚙️</span>
                        Settings
                    </a>
                </li>
                <li>
                    <a href="#!" onClick={onLogout}>
                        <span className="menu-icon">🚪</span>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );
};

const MessageStatsChart = ({ stats }) => {
    // Prepare data for the chart
    const chartData = {
        labels: stats.map(stat => stat.date),
        datasets: [
            {
                label: 'Messages Received',
                data: stats.map(stat => stat.count),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Messages Received Over Time'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="stats-chart">
            <Line data={chartData} options={options} />
        </div>
    );
};

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);
    const [replySuccess, setReplySuccess] = useState('');
    const [messageReplies, setMessageReplies] = useState({});
    const [showAddDocument, setShowAddDocument] = useState(false);
    const [newDocument, setNewDocument] = useState({
        file: null,
        documentType: 'certificate'
    });
    const [uploadingDocument, setUploadingDocument] = useState(false);
    
    const [announcements, setAnnouncements] = useState([]);
    const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        file: null,
        type: 'text'
    });
    const [uploadingAnnouncement, setUploadingAnnouncement] = useState(false);
    
    // Add state for message statistics
    const [messageStats, setMessageStats] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    
    // Add state for active menu
    const [activeMenu, setActiveMenu] = useState('dashboard');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setStatsLoading(true);
                
                const [msgRes, docRes, annRes, statsRes] = await Promise.all([
                    axios.get('/api/admin/messages'),
                    axios.get('/api/admin/documents'),
                    axios.get('/api/admin/announcements'),
                    axios.get('/api/admin/messages/stats') // New endpoint for message stats
                ]);
                
                // Process announcements with comments
                const announcementsWithComments = await Promise.all(
                    annRes.data.map(async ann => {
                        try {
                            const commentsRes = await axios.get(`/api/announcements/${ann.id}/comments`);
                            
                            const commentsWithReplies = await Promise.all(
                                commentsRes.data.map(async comment => {
                                    const repliesRes = await axios.get(`/api/comments/${comment.id}/replies`);
                                    return { ...comment, replies: repliesRes.data };
                                })
                            );
                            
                            return { ...ann, comments: commentsWithReplies };
                        } catch {
                            return { ...ann, comments: [] };
                        }
                    })
                );
                
                setMessages(msgRes.data);
                setDocuments(docRes.data);
                setAnnouncements(announcementsWithComments);
                setMessageStats(statsRes.data); // Set message statistics
                setError('');
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setError('Failed to load data. Please try again.');
                if (err.response?.status === 401) {
                    logout();
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
                setStatsLoading(false);
            }
        };
        fetchData();
    }, [logout, navigate]);

    const fetchReplies = async (messageId) => {
        try {
            const response = await axios.get(`/api/admin/messages/${messageId}/replies`);
            setMessageReplies(prev => ({
                ...prev,
                [messageId]: response.data
            }));
        } catch (err) {
            console.error("Failed to fetch replies", err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        
        setReplying(true);
        try {
            await axios.post(`/api/admin/messages/${selectedMessage.id}/reply`, {
                reply_text: replyText
            });
            setReplySuccess('Reply sent successfully!');
            setReplyText('');
            fetchReplies(selectedMessage.id);
            setTimeout(() => {
                setReplySuccess('');
            }, 2000);
        } catch (err) {
            console.error('Error sending reply:', err);
            setError('Failed to send reply. Please try again.');
        } finally {
            setReplying(false);
        }
    };

    const handleViewReplies = (messageId) => {
        if (!messageReplies[messageId]) {
            fetchReplies(messageId);
        }
        setSelectedMessage(messages.find(msg => msg.id === messageId));
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            await axios.delete(`/api/admin/messages/${messageId}`);
            setMessages(messages.filter(msg => msg.id !== messageId));
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null);
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Failed to delete message');
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        
        try {
            await axios.delete(`/api/admin/documents/${documentId}`);
            setDocuments(documents.filter(doc => doc.id !== documentId));
        } catch (err) {
            console.error('Error deleting document:', err);
            setError('Failed to delete document');
        }
    };

    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        if (!newDocument.file) {
            setError('Please select a file');
            return;
        }
        
        setUploadingDocument(true);
        setError('');
        
        const formData = new FormData();
        formData.append('document', newDocument.file);
        formData.append('documentType', newDocument.documentType);
        
        try {
            const { data } = await axios.post('/api/admin/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDocuments([data, ...documents]);
            setShowAddDocument(false);
            setNewDocument({
                file: null,
                documentType: 'certificate'
            });
        } catch (err) {
            console.error('Error uploading document:', err);
            setError(err.response?.data?.error || 'Failed to upload document');
        } finally {
            setUploadingDocument(false);
        }
    };

    const handleDocumentUpdate = async (documentId, newType) => {
        try {
            const { data } = await axios.put(`/api/admin/documents/${documentId}`, {
                file_type: newType
            });
            setDocuments(documents.map(doc => 
                doc.id === documentId ? { ...doc, file_type: data.file_type } : doc
            ));
        } catch (err) {
            console.error('Error updating document:', err);
            setError('Failed to update document');
        }
    };
    
    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        
        if (!newAnnouncement.title) {
            setError('Title is required');
            return;
        }
        
        setUploadingAnnouncement(true);
        setError('');
        
        const formData = new FormData();
        formData.append('title', newAnnouncement.title);
        formData.append('content', newAnnouncement.content);
        formData.append('type', newAnnouncement.type);
        if (newAnnouncement.file) {
            formData.append('file', newAnnouncement.file);
        }
        
        try {
            await axios.post('/api/admin/announcements', formData);
            setShowAddAnnouncement(false);
            setNewAnnouncement({
                title: '',
                content: '',
                file: null,
                type: 'text'
            });
            // Refresh announcements
            const { data } = await axios.get('/api/admin/announcements');
            
            // Fetch comments for new announcements
            const announcementsWithComments = await Promise.all(
                data.map(async ann => {
                    try {
                        const commentsRes = await axios.get(`/api/announcements/${ann.id}/comments`);
                        
                        // Fetch replies for each comment
                        const commentsWithReplies = await Promise.all(
                            commentsRes.data.map(async comment => {
                                const repliesRes = await axios.get(`/api/comments/${comment.id}/replies`);
                                return { ...comment, replies: repliesRes.data };
                            })
                        );
                        
                        return { ...ann, comments: commentsWithReplies };
                    } catch {
                        return { ...ann, comments: [] };
                    }
                })
            );
            
            setAnnouncements(announcementsWithComments);
        } catch (err) {
            console.error('Error creating announcement:', err);
            setError(err.response?.data?.error || 'Failed to create announcement');
        } finally {
            setUploadingAnnouncement(false);
        }
    };
    
    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        
        try {
            await axios.delete(`/api/admin/announcements/${id}`);
            setAnnouncements(announcements.filter(ann => ann.id !== id));
        } catch (err) {
            console.error('Error deleting announcement:', err);
            setError('Failed to delete announcement');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        try {
            await axios.delete(`/api/admin/announcements/comments/${commentId}`);
            
            // Update announcements state
            setAnnouncements(prev => prev.map(ann => {
                if (ann.comments) {
                    return {
                        ...ann,
                        comments: ann.comments.filter(comment => comment.id !== commentId)
                    };
                }
                return ann;
            }));
        } catch (err) {
            setError('Failed to delete comment');
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) return;
        
        try {
            await axios.delete(`/api/admin/comments/replies/${replyId}`);
            
            // Update announcements state
            setAnnouncements(prev => prev.map(ann => {
                if (ann.comments) {
                    return {
                        ...ann,
                        comments: ann.comments.map(comment => {
                            if (comment.replies) {
                                return {
                                    ...comment,
                                    replies: comment.replies.filter(reply => reply.id !== replyId)
                                };
                            }
                            return comment;
                        })
                    };
                }
                return ann;
            }));
        } catch (err) {
            setError('Failed to delete reply');
        }
    };

    const handleAddReply = async (commentId, replyText) => {
        if (!replyText.trim()) return;
        
        try {
            const { data } = await axios.post(`/api/comments/${commentId}/replies`, {
                reply_text: replyText,
                replier_name: 'Admin'
            });
            
            // Update announcements state
            setAnnouncements(prev => prev.map(ann => {
                if (ann.comments) {
                    return {
                        ...ann,
                        comments: ann.comments.map(comment => {
                            if (comment.id === commentId) {
                                const updatedReplies = [...(comment.replies || []), data];
                                return { ...comment, replies: updatedReplies };
                            }
                            return comment;
                        })
                    };
                }
                return ann;
            }));
            
            return data;
        } catch (err) {
            setError('Failed to add reply');
        }
    };

    const renderMainContent = () => {
        switch(activeMenu) {
            case 'dashboard':
                return (
                    <>
                        {/* Message Statistics Chart Section */}
                        <div className="admin-section">
                            <h2>📈 Message Statistics</h2>
                            {statsLoading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading statistics...</p>
                                </div>
                            ) : messageStats.length > 0 ? (
                                <MessageStatsChart stats={messageStats} />
                            ) : (
                                <p>No message statistics available yet.</p>
                            )}
                        </div>

                        <div className="admin-section">
                            <h2>📨 Recent Messages ({messages.length})</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.slice(0, 5).map(msg => (
                                            <tr key={msg.id}>
                                                <td>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td>{msg.message.length > 50 ? `${msg.message.substring(0, 50)}...` : msg.message}</td>
                                                <td>{new Date(msg.received_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-reply"
                                                            onClick={() => handleViewReplies(msg.id)}
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="admin-section">
                            <h2>📁 Recent Documents ({documents.length})</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Filename</th>
                                            <th>Type</th>
                                            <th>Upload Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.slice(0, 5).map(doc => (
                                            <tr key={doc.id}>
                                                <td>{doc.original_name}</td>
                                                <td>{doc.file_type}</td>
                                                <td>{new Date(doc.upload_date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            case 'messages':
                return (
                    <>
                        <div className="admin-section">
                            <h2>📨 Contact Form Messages ({messages.length})</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map(msg => (
                                            <tr key={msg.id}>
                                                <td>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td>{msg.message.length > 50 ? `${msg.message.substring(0, 50)}...` : msg.message}</td>
                                                <td>{new Date(msg.received_at).toLocaleString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-reply"
                                                            onClick={() => handleViewReplies(msg.id)}
                                                        >
                                                            {selectedMessage?.id === msg.id ? 'Hide' : 'View'}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedMessage && (
                            <div className="admin-section">
                                <h3>Message from: {selectedMessage.name} ({selectedMessage.email})</h3>
                                <div className="message-content">
                                    <p><strong>Received:</strong> {new Date(selectedMessage.received_at).toLocaleString()}</p>
                                    <p><strong>Message:</strong> {selectedMessage.message}</p>
                                </div>

                                <div className="replies-section">
                                    <h4>Replies:</h4>
                                    {messageReplies[selectedMessage.id]?.length > 0 ? (
                                        <div className極="replies-list">
                                            {messageReplies[selectedMessage.id].map(reply => (
                                                <div key={reply.id} className="reply-item">
                                                    <p><strong>Replied:</strong> {new Date(reply.replied_at).toLocaleString()}</p>
                                                    <p>{reply.reply_text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No replies yet</p>
                                    )}
                                </div>

                                <form onSubmit={handleReplySubmit} className="reply-form">
                                    <div className="form-group">
                                        <label>Your Reply</label>
                                        <textarea
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            required
                                            rows="5"
                                        ></textarea>
                                    </div>
                                    {replySuccess && <div className="alert alert-success">{replySuccess}</div>}
                                    <div className="form-actions">
                                        <button type="submit" className="btn" disabled={replying}>
                                            {replying ? 'Sending...' : 'Send Reply'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-clear"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                );
            case 'documents':
                return (
                    <div className="admin-section">
                        <div className="admin-documents-header">
                            <h2>📁 Uploaded Documents ({documents.length})</h2>
                            <button 
                                className="btn btn-add"
                                onClick={() => setShowAddDocument(!showAddDocument)}
                            >
                                {showAddDocument ? 'Cancel' : '➕ Add Document'}
                            </button>
                        </div>

                        {showAddDocument && (
                            <div className="upload-section">
                                <h3>Upload New Document</h3>
                                <form onSubmit={handleDocumentUpload}>
                                    <div className="form-group">
                                        <label>Document Type</label>
                                        <select 
                                            value={newDocument.documentType}
                                            onChange={e => setNewDocument({...newDocument, documentType: e.target.value})}
                                            required
                                        >
                                            <option value="certificate">Academic Certificate</option>
                                            <option value="cv">CV</option>
                                            <option value="transcript">Transcript</option>
                                            <option value="other">Other Document</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Select File (PDF, DOC, JPG, PNG - max 50MB)</label>
                                        <input 
                                            type="file" 
                                            onChange={e => setNewDocument({...newDocument, file: e.target.files[0]})}
                                            required 
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                    </div>
                                    <button type="submit" className="btn" disabled極={uploadingDocument}>
                                        {uploadingDocument ? 'Uploading...' : 'Upload Document'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Type</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map(doc => (
                                        <tr key={doc.id}>
                                            <td>{doc.original_name}</td>
                                            <td>
                                                <select
                                                    value={doc.file_type}
                                                    onChange={(e) => handleDocumentUpdate(doc.id, e.target.value)}
                                                    className="document-type-select"
                                                >
                                                    <option value="certificate">Certificate</option>
                                                    <option value="cv">CV</option>
                                                    <option value="transcript">Transcript</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </td>
                                            <td>{new Date(doc.upload_date).toLocaleString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <a 
                                                        href={`${API_URL}${doc.file_path}`} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="btn-preview"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDeleteDocument(doc.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'announcements':
                return (
                    <div className="admin-section">
                        <div className="admin-documents-header">
                            <h2>📢 Announcements ({announcements.length})</h2>
                            <button 
                                className="btn btn-add"
                                onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
                            >
                                {showAddAnnouncement ? 'Cancel' : '➕ Add Announcement'}
                            </button>
                        </div>

                        {showAddAnnouncement && (
                            <div className="upload-section">
                                <h3>Create New Announcement</h3>
                                <form onSubmit={handleAnnouncementSubmit}>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input 
                                            type="text" 
                                            value={newAnnouncement.title}
                                            onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                                            required
                                            placeholder="Announcement title"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Content</label>
                                        <textarea 
                                            value={newAnnouncement.content}
                                            onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                                            rows="4"
                                            placeholder="Announcement details..."
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select 
                                            value={newAnnouncement.type}
                                            onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                                            required
                                        >
                                            <option value="極text">Text</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                            <option value="audio">Audio</option>
                                            <option value="file">File</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Attachment (if needed)</label>
                                        <input 
                                            type="file" 
                                            onChange={e => setNewAnnouncement({...newAnnouncement, file: e.target.files[0]})}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.avi,.mov,.wav"
                                        />
                                        <small>Max size: 50MB. Allowed: PDF, DOC, JPG, PNG, MP4, MP3, AVI, MOV, WAV</small>
                                    </div>
                                    <button type="submit" className="btn" disabled={uploadingAnnouncement}>
                                        {uploadingAnnouncement ? 'Creating...' : 'Create Announcement'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="announcements-admin-list">
                            {announcements.map(ann => (
                                <div key={ann.id} className="admin-announcement-item">
                                    <div className="announcement-header">
                                        <h3>{ann.title}</h3>
                                        <span className="announcement-date">
                                            {new Date(ann.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="announcement-content">
                                        <p>{ann.content}</p>
                                        {ann.file_path && (
                                            <div className="announcement-attachment">
                                                <a 
                                                    href={`${API_URL}${ann.file_path}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn-preview"
                                                >
                                                    View Attachment
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="comments-section">
                                        <h4>Comments ({ann.comments?.length || 0})</h4>
                                        {ann.comments?.length > 0 ? (
                                            <div className="comments-list">
                                                {ann.comments.map(comment => (
                                                    <div key={comment.id} className="comment-item">
                                                        <div className="comment-header">
                                                            <strong>{comment.commenter_name}</strong>
                                                            <span>{new Date(comment.commented_at).toLocaleString()}</span>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                        <p className="comment-text">{comment.comment_text}</p>
                                                        
                                                        <div className="replies-section">
                                                            <h5>Replies ({comment.replies?.length || 0})</h5>
                                                            {comment.replies?.length > 0 ? (
                                                                <ul className="replies-list">
                                                                    {comment.replies.map(reply => (
                                                                        <li key={reply.id} className="reply-item">
                                                                            <div className="reply-header">
                                                                                <strong>{reply.replier_name}</strong>
                                                                                <span>{new Date(reply.replied_at).toLocaleString()}</span>
                                                                                <button
                                                                                    className="btn btn-sm btn-danger"
                                                                                    onClick={() => handleDeleteReply(reply.id)}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                            <p className="reply-text">{reply.reply_text}</p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p>No replies yet</p>
                                                            )}
                                                            
                                                            <form 
                                                                className="reply-form"
                                                                onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    const replyText = e.target.reply.value;
                                                                    if (replyText) {
                                                                        handleAddReply(comment.id, replyText);
                                                                        e.target.reset();
                                                                    }
                                                                }}
                                                            >
                                                                <div className="form-group">
                                                                    <textarea
                                                                        name="reply"
                                                                        placeholder="Your reply..."
                                                                        rows="2"
                                                                        required
                                                                    ></textarea>
                                                                </div>
                                                                <button type="submit" className="btn">Add Reply</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No comments for this announcement</p>
                                        )}
                                    </div>
                                    
                                    <div className="announcement-actions">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteAnnouncement(ann.id)}
                                        >
                                            Delete Announcement
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="admin-section">
                        <h2>⚙️ Settings</h2>
                        <div className="settings-grid">
                            <div className="setting-card">
                                <h3>👤 Profile Settings</h3>
                                <p>Update your admin profile information</p>
                                <button className="btn">Edit Profile</button>
                            </div>
                            <div className="setting-card">
                                <h3>🔒 Password Settings</h3>
                                <p>Change your admin password</p>
                                <button className="btn">Change Password</button>
                            </div>
                            <div className="setting-card">
                                <h3>🔔 Notification Settings</h3>
                                <p>Configure email notifications</p>
                                <button className="btn">Configure</button>
                            </div>
                            <div className="setting-card">
                                <h3>⚙️ System Settings</h3>
                                <p>Configure system preferences</p>
                                <button className="btn">Configure</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a menu option</div>;
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={handleLogout} />
            <div className="admin-main">
                <div className="admin-header">
                    <div className="page-title">
                        <h1>
                            {activeMenu === 'dashboard' && '📊 Dashboard'}
                            {activeMenu === 'messages' && '✉️ Messages'}
                            {activeMenu === 'documents' && '📁 Documents'}
                            {activeMenu === 'announcements' && '📢 Announcements'}
                            {activeMenu === 'settings' && '⚙️ Settings'}
                        </h1>
                        <p>
                            {activeMenu === 'dashboard' && 'Overview of your admin dashboard'}
                            {activeMenu === 'messages' && 'Manage contact form messages'}
                            {activeMenu === 'documents' && 'Manage uploaded documents'}
                            {activeMenu === 'announcements' && 'Create and manage announcements'}
                            {activeMenu === 'settings' && 'Configure system settings'}
                        </p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-notification">
                            <span className="notification-icon">🔔</span>
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="user-menu">
                            <img src={profileImage} alt="Admin" className="user-avatar" />
                            <span>Admin</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading data...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                    </div>
                ) : (
                    renderMainContent()
                )}
            </div>
        </div>
    );
};


const Portfolio = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('home');
    
    useEffect(() => {
        axios.get('/api/portfolio')
            .then(response => {
                setProfileData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data", error);
                setLoading(false);
                // Set default data if API fails
                setProfileData({
                    profile: {
                        full_name: "Imanigirigihe Emmanuel",
                        bio: "I am a passionate and dedicated Business Information Technology student...",
                        email: "imanigirigiheemmanuel@gmail.com",
                        // ... other default profile properties
                    },
                    skills: [],
                    education: []
                });
            });
    }, []);
    
    const renderPage = () => {
        if (!profileData) return null;
        
        switch(currentPage) {
            case 'home': return <Home profile={profileData.profile} setCurrentPage={setCurrentPage} />;
            case 'about': return <About profile={profileData.profile} setCurrentPage={setCurrentPage} />;
            case 'skills': return <Skills skills={profileData.skills} />;
            case 'education': return <Education education={profileData.education} />;
            case 'documents': return <Documents />;
            case 'announcements': return <Announcements />;
            case 'contact': return <Contact profile={profileData.profile} />;
            default: return <Home profile={profileData.profile} setCurrentPage={setCurrentPage} />;
        }
    };
    
    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading portfolio...</p></div>;
    if (!profileData) return <div className="error-container"><h2>Error loading profile data</h2></div>;
    
    return (
        <div className="App">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {renderPage()}
            <Footer />
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/admin/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Portfolio />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;