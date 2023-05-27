import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("http://localhost:8080/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllItems();
    //eslint-disable-next-line
  }, []);

  //handle deleet
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("http://localhost:8080/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Succesfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //able data
  const columns = [
    { title: "Nombre", dataIndex: "name" },
    {
      title: "Imagen",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Precio", dataIndex: "price" },

    {
      title: "Acciones",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form  submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post("http://localhost:8080/api/items/add-item", value);
        message.success("Item Added Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put("http://localhost:8080/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Updated Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Lista De Articulos </h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Agregar Articulo
        </Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Editar Articulo " : "Agregar Articulo"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Nombre">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Precio">
              <Input />
            </Form.Item>
            <Form.Item name="image" label="Imagen URL">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Categoria">
              <Select>
                <Select.Option value="Bebida">Bebida</Select.Option>
                <Select.Option value="Arroz">Arroz</Select.Option>
                <Select.Option value="Sopa">Sopa</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;