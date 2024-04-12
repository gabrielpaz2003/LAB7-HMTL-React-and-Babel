const { useState } = React;

const NavBar = () => {
    const styles = {
        position: 'fixed', // Fijar la posición de la barra de navegación
        top: 0, // Colocarla en la parte superior  
        marginBottom: '100px',
        background: 'black',
        color: 'black', // color de texto
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0%',
        alignItems: 'center',
        height: '10vh',
        width: '100%',
        zIndex: 1000, // Asegurar que esté por encima de otros elementos
    };

    const logoStyles = {
        filter: 'invert(100%)',
        padding: '5%',
        height:'auto',
    };

    const h2Styles = {
        fontFamily: 'Roboto',
        fontSize: '1.5em', 
        fontWeight: 'bold',
        margin: '0',
        padding: '5%',
        color: 'white',
        textDecoration: 'none', 
    };
    
    return (
        <nav style={styles}>
            <img src='../resources/sci-fi-logo.png' alt="logo" width="40" height="40" style={logoStyles} />
            <a href='../index.html' style={h2Styles}>Home</a>
            <a href='./post.html' style={h2Styles}>Posts</a>
            <a href='./newpost.html' style={h2Styles}>Nuevo Post</a>
        </nav>
    );
    
}

const Loading = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>Loading...</h1>
        </div>
    );
};

// Estilos para el formulario y sus campos
const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px', // Tamaño máximo para el formulario
    marginTop: '10rem',
    marginLeft: '11rem', // Centrar el formulario en la página
    padding: '1rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Sombra suave para resaltar el formulario
    borderRadius: '8px', // Bordes redondeados para el formulario
    background: 'white', // Fondo blanco para el formulario
  };
  
  const inputStyles = {
    padding: '0.5rem',
    margin: '0.5rem 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };
  
  const textAreaStyles = {
    ...inputStyles,
    minHeight: '150px', // Altura mínima para el textarea
  };
  
  const buttonStyles = {
    padding: '0.5rem 1rem',
    margin: '1rem 0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#000080', // Un color azul estándar para el botón
    color: 'white',
  };
  
  const labelStyles = {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  };
  
  const PostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
  
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
  
    const handleContentChange = (event) => {
        setContent(event.target.value);
    };
  
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
    
        // Crear el objeto de la solicitud sin la imagen
        const postBody = {
            title: title,
            content: content,
        };
    
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Especificamos que enviaremos un JSON
                },
                body: JSON.stringify(postBody), // Convertimos el objeto de la solicitud a JSON
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Esperamos la respuesta como JSON si tu servidor responde con JSON
            const result = await response.json();
            setMessage('Post added successfully!');
            setTitle('');
            setContent('');
        } catch (e) {
            setMessage('Failed to add post: ' + e.message);
        } finally {
            setLoading(false);
        }
    };
  
    return (
        <div>
            <form onSubmit={handleSubmit} style={formStyles}>
                <div>
                    <label style={labelStyles}>Titulo:</label>
                    <input type="text" value={title} onChange={handleTitleChange} required style={inputStyles} />
                </div>
                <div>
                    <label style={labelStyles}>Contenido:</label>
                    <textarea value={content} onChange={handleContentChange} required style={textAreaStyles}></textarea>
                </div>
                <div>
                    <label style={labelStyles}>Imagen:</label>
                    <input type="file" onChange={handleImageChange} style={inputStyles} />
                </div>
                <button type="submit" disabled={loading} style={buttonStyles}>
                    {loading ? 'Adding...' : 'Add Post'}
                </button>
            </form>
        </div>
    );
  };
  

const Footer = () => {
    const styles = {
        position: 'fixed', // Fijar la posición del footer
        bottom: 0, // Colocarla en la parte inferior
        background: 'black',
        color: 'white', // color de texto
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0%',
        height: '5vh',
        width: '100%',
        zIndex: 1000, // Asegurar que esté por encima de otros elementos
    };

    return (
        <footer style={styles}>
            <p>&copy; 2024 - Todos los derechos reservados Gabriel Paz UVG</p>
        </footer>
    );
}

const App = () => {


    const styles = {
        backgroundColor: 'White', // color de fondo
        overflow: 'hidden', // ocultar el desbordamiento del contenido
        minHeight: '100vh', // altura mínima para cubrir toda la pantalla
        display: 'block',
        position : 'relative',
        margin: 0,
        padding: 0,
    };
    return (
        <main style={styles}>
            <NavBar />
            <React.Suspense fallback={<Loading />}>
                <PostForm />
            </React.Suspense>
            <Footer />
        </main>
    );
}


const root = document.getElementById('root');
ReactDOM.render(<App />, root);
