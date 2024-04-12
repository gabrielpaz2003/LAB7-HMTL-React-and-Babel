const NavBar = () => {
    const styles = {
        position: 'fixed', // Fijar la posición de la barra de navegación
        top: 0, // Colocarla en la parte superior  
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

const PostsLoader = () => {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const deletePost = async (id) => {
        console.log(posts[id]);
        if (window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
            try {
                const response = await fetch(`http://localhost:3000/posts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Si la eliminación fue exitosa, filtra el post eliminado del estado
                setPosts(prevPosts => prevPosts.filter((post) => post.id !== id));
            } catch (error) {
                console.error('Error al eliminar el post:', error);
            }
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/posts');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error("Formato de datos incorrecto");
                }
                setPosts(data);
            } catch (error) {
                console.error('Error al cargar los posts:', error);
                setError(error.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>Error al cargar los posts</h1>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>No hay posts disponibles</h1>
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Card key={post.id} post={post} onDelete={deletePost} />
            ))}
        </>
    );
};

const Card = ({ post, onDelete }) => {
    const [isColumnLayout, setIsColumnLayout] = React.useState(window.innerWidth <= 768);
    
    const cardStyles = {
        boxSizing: 'border-box',
        padding: '2%',
        margin: '5rem 0 0 0',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        backgroundColor: '	#000080',
        display: 'flex',
        alignItems: 'center',
        flexDirection: isColumnLayout ? 'column' : 'row', 
        gap: '1rem',
    };

    const TitleStyles = {
        color: 'white',
        textAlign: 'center',
        fontSize: '22px',
        fontFamily: 'Roboto',
        flex: '1',
    };

    const textsStyles = {
        color: 'white',
        textAlign: 'justify',
        fontFamily: 'Roboto',
        opacity: '0.8',
        flex: '2', // Ajuste para mantener la proporción si no hay imagen
    };

    const imageStyles = {
        maxHeight: '300px',
        maxWidth: '100%',
        borderRadius: '5px',
        flex: '1',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const buttonStyles = {
        padding: '0.5rem 1rem',
        alignItems:  'center',
        margin: '1rem 0',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        background: 'white', // Un color azul estándar para el botón
        color: 'black',
      };

      const divStyle = {
        margin: 'auto',
        alignItems: 'center'
      };

    // Función para manejar el cambio de tamaño de la ventana
    const handleResize = () => {
        setIsColumnLayout(window.innerWidth <= 768);
    };

    const handleEdit = () => {
        // Redirigir al usuario a updatepost.html con el ID del post como parámetro de consulta
        window.location.href = `./updatepost.html?postId=${post.id}`;
    };

    // Efecto para escuchar el cambio de tamaño de la ventana
    React.useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Limpieza del evento
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const imageSrc = post.image_64 || '../resources/no-image.jpg';

    return (
        <div style={cardStyles}>
            <img src={imageSrc} alt={post.title} style={imageStyles} />
            <div style={{ flex: '1' }}>
                <h3 style={TitleStyles}>{post.title}</h3>
                <p style={textsStyles}>{post.content}</p>
                {/* Agregamos los botones de eliminar y editar aquí */}
            <div style={divStyle}>
                <button onClick={() => onDelete(post.id)} style={buttonStyles}>Eliminar</button>
                {/* Asumiendo que tienes una función onEdit definida y pasada a Card: */}
                <button onClick={handleEdit} style={buttonStyles}>Editar</button>
            </div>
                
            </div>
        </div>
    );
};


Card.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        titulo: PropTypes.string,
        contenido: PropTypes.string,
        imagen_url: PropTypes.string,
    }),
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
                <PostsLoader />
            </React.Suspense>
            <Footer />
        </main>
    );
}


const root = document.getElementById('root');
ReactDOM.render(<App />, root);