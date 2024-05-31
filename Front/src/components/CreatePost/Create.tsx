import React, { useState } from 'react';
import axios from 'axios';
import './create.css';

function Create() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (userId) {
            formData.append('created_by', userId);
        }

        if (files) {
            Array.from(files).forEach((file) => {
                formData.append('media', file); // Ensure the name matches 'media'
            });
        }

        try {
            const response = await axios.post('http://localhost:3000/api/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Post created:', response.data);
            setTitle('');
            setContent('');
            setFiles(null);
        } catch (error) {
            console.error('Error creating post:', error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Server responded with:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Axios error message:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="create-post">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        name="content"
                        onChange={handleContentChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="media">Upload Files:</label>
                    <input
                        type="file"
                        id="media"
                        name="media"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}

export default Create;