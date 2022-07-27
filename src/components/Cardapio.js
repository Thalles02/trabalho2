import React, { useEffect, useState } from "react";
import axios from "axios";
import imgEdit from "../img/editar-texto.png";
import imgDelete from "../img/lixeira.png";
import imgLogo from "../img/logo.jpg";
import './Cardapio.css';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [sabor, setSabor] = useState("");
    const [preco, setPreco] = useState("");
    const [tipo, setTipo] = useState("");

    const url = "http://localhost:8081/";

    useEffect(() => {
        fetch(url + "item")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    function novosDados() {
        setTipo("novo");
    }

    function cancelarDados() {
        setId("");
        setNome("");
        setSabor("");
        setPreco("");
        setTipo("");
    }

    function editarDados(cod) {
        console.log(cod);
        let usuario = usuarios.find(item => item.id === cod);
        const { id, nome, sabor, preco } = usuario;
        console.log(usuario);
        setTipo("editar");
        setId(id);
        setNome(nome);
        setSabor(sabor);
        setPreco(preco);

    }

    function gravaDados() {
        if (nome !== "" && sabor !== "" && preco !== "") {
            if (tipo === "novo") {
                axios
                    .post(url + "item", {
                        nome: nome,
                        sabor: sabor,
                        preco: preco,
                    })
                    .then((response) => atualizaListaNovoUsuario(response))
                    .catch((err) => console.log(err));
            } else if (tipo === "editar") {
                axios.put(url + "item/" + id, {
                    id: id,
                    nome: nome,
                    sabor: sabor,
                    preco: preco,
                })
                    .then(response => atualizaListaUsuariosEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    }

    function atualizaListaNovoUsuario(response) {
        let { id, nome, sabor, preco } = response.data;
        let obj = { id: id, nome: nome, sabor: sabor, preco: preco };
        let users = usuarios;
        users.push(obj);
        setUsuarios(users);
        cancelarDados("");
    }

    function atualizaListaUsuariosEditado(response) {
        let { id } = response.data;
        const index = usuarios.findIndex(item => item.id == id); //eslint-disable-line
        let users = usuarios;
        users[index].nome = nome;
        users[index].sabor = sabor;
        users[index].preco = preco;
        setUsuarios(users);
        cancelarDados("");
    }

    function deletaDados(cod) {
        axios.delete(url + "item/" + cod).then(() => {
            setUsuarios(usuarios.filter((item) => item.id !== cod))
        })
    }

    return (
        <div>
            {usuarios
                ? usuarios.map((item) => {
                    return (
                        <div key={item.id}>
                            <div class="pedidos-cards">
                                <div class="item">
                                    <img class="img-card-pedido" src={imgLogo} alt="pizza de Camarão" />
                                    <h4><span>{item.nome} -</span> {item.sabor} - R${item.preco}</h4>
                                    <img
                                        class="img-add"
                                        alt="Editar"
                                        src={imgEdit}
                                        id={item.id}
                                        height={20}
                                        width={20}
                                        onClick={(e) => editarDados(item.id)}
                                    />
                                    <img
                                        class="img-add"
                                        alt="Deletar"
                                        src={imgDelete}
                                        id={item.id}
                                        height={20}
                                        width={20}
                                        onClick={(e) => deletaDados(item.id)}
                                    />

                                </div>
                            </div>
                        </div>
                    );
                })
                : false}

            <div class="pedidos-cards">
                <section class="btn-add">
                    <button type="button" onClick={novosDados}>
                        Novo
                    </button>
                </section>

                {tipo ? (
                    <>
                        <input
                            type="text"
                            name="txtNome"
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value);
                            }}
                        />
                        <input
                            type="text"
                            name="txtsabor"
                            value={sabor}
                            onChange={(e) => {
                                setSabor(e.target.value);
                            }}
                        />
                        <input
                            type="text"
                            name="txtpreco"
                            value={preco}
                            onChange={(e) => {
                                setPreco(e.target.value);
                            }}
                        />
                        <button type="button" onClick={cancelarDados}>
                            Cancelar
                        </button>
                        <button type="button" onClick={gravaDados}>
                            Gravar
                        </button>
                    </>
                ) : (
                    false
                )}
            </div>


        </div>
    );
}