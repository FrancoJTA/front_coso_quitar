import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CREAR_CUENTA = gql`
  mutation nuevoUsuario($input: inputUsuario) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
      creado
    }
  }
`;

// Mutation para crear nuevos usuarios o vendedores (CREAR NUEVA CUENTA)
const NuevaCuenta = () => {
    const [mensaje, setMensaje] = useState(null); // Estado para mensajes
    const [nuevoUsuario] = useMutation(CREAR_CUENTA);
    const router = useRouter();

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es requerido'),
            apellido: Yup.string().required('El apellido es requerido'),
            email: Yup.string().email('El email no es valido').required('El email es requerido'),
            password: Yup.string().required('El password es requerido').min(6, 'El Password debe tener al menos seis caracteres')
        }),
        onSubmit: async (datos) => {
            const { nombre, apellido, email, password } = datos;

            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });

                // Si la mutación es exitosa, mostramos un mensaje de éxito
                setMensaje({ tipo: 'exito', texto: 'Cuenta creada exitosamente' });

                // Redirigir al login o página principal
                router.push('/login'); // O la página que desees
            } catch (err) {
                console.log(err);
                setMensaje({ tipo: 'error', texto: 'Hubo un error al crear la cuenta' });
            }
        }
    });

    return (
        <Layout>
            <h1 className="text-center text-2xl text-white font-light">Crear Cuenta</h1>

            {/* Mostrar mensaje de éxito o error */}
            {mensaje && (
                <div className={`text-center ${mensaje.tipo === 'exito' ? 'text-green-500' : 'text-red-500'}`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto mt-8">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-white">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-2 p-2 w-full border rounded"
                    />
                    {formik.touched.nombre && formik.errors.nombre && <div className="text-red-500 text-sm">{formik.errors.nombre}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="apellido" className="block text-sm font-medium text-white">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formik.values.apellido}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-2 p-2 w-full border rounded"
                    />
                    {formik.touched.apellido && formik.errors.apellido && <div className="text-red-500 text-sm">{formik.errors.apellido}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-2 p-2 w-full border rounded"
                    />
                    {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-2 p-2 w-full border rounded"
                    />
                    {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
                </div>

                <button
                    type="submit"
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full w-full"
                >
                    Crear cuenta
                </button>
            </form>
        </Layout>
    );
};

export default NuevaCuenta;
