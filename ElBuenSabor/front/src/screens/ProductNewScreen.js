import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
//import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const reducer = (state, action) => {
  switch (action.type) {
    /* case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        rubros: action.payload.rubros,
        
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; */

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'UPLOAD_REQUEST':
      return {
        ...state,
        loadingUpload: true,
        errorUpload: '',
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };
    default:
      return state;
  }
};

export default function ProductNewScreen() {
  const navigate = useNavigate();
  const [{ loadingUpload, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [nombreProducto, setNombreProducto] = useState('');
  const [tiempoCocinaProducto, setTiempoCocinaProducto] = useState();
  const [recetaProducto, setRecetaProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [imagenProducto, setImagenProducto] = useState('');
  const [precioVentaProducto, setPrecioVentaProducto] = useState();
  const [altaProducto, setAltaProducto] = useState(true);
  const [rubroProducto, setRubroProducto] = useState('');
  /* const [rubroProducto, setRubroProducto] = useState(null); */
  //const [stockProducto, setStockProducto] = useState();
  const [isCeliaco, setIsCeliaco] = useState(false);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [rubros, setRubros] = useState([]);

  const [ingredientesDB, setIngredientesDB] = useState([]);
  const [ingredientesProducto, setIngredientesProducto] = useState([]);
  //const [listId, setListId] = useState(1);
  const [costoProducto, setCostoProducto] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        ////let { data } = await axios.get(`/api/rubros`);
        //datos = JSON.parse(datos);
        //console.log(data);
        ////setRubros(data);
        Promise.all([getRubros(), getIngredientesDB()]).then(function (
          results
        ) {
          setRubros(results[0].data);
          setIngredientesDB(results[1].data);
        });
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchData();

    localStorage.getItem('nombreProducto') &&
      setNombreProducto(localStorage.getItem('nombreProducto'));
    localStorage.getItem('tiempoCocinaProducto') &&
      setTiempoCocinaProducto(localStorage.getItem('tiempoCocinaProducto'));
    localStorage.getItem('recetaProducto') &&
      setRecetaProducto(localStorage.getItem('recetaProducto'));
    localStorage.getItem('descripcionProducto') &&
      setDescripcionProducto(localStorage.getItem('descripcionProducto'));
    localStorage.getItem('imagenProducto') &&
      setImagenProducto(localStorage.getItem('imagenProducto'));
    localStorage.getItem('precioVentaProducto') &&
      setPrecioVentaProducto(localStorage.getItem('precioVentaProducto'));
    localStorage.getItem('altaProducto') &&
      setAltaProducto(
        localStorage.getItem('altaProducto') === 'true' ? true : false
      );
    localStorage.getItem('isVegetariano') &&
      setIsVegetariano(
        localStorage.getItem('isVegetariano') === 'true' ? true : false
      );
    localStorage.getItem('isCeliaco') &&
      setIsCeliaco(localStorage.getItem('isCeliaco') === 'true' ? true : false);
    localStorage.getItem('rubroProducto') &&
      setRubroProducto(localStorage.getItem('rubroProducto'));
    /* localStorage.getItem('stockProducto') &&
      setStockProducto(localStorage.getItem('stockProducto')); */
    /* localStorage.getItem('ingredientesProducto') &&
      setIngredientesProducto(JSON.parse(localStorage.getItem('ingredientesProducto')));  */
  }, []);

  useEffect(() => {
    const calcularCosto = () => {
      setCostoProducto(0);
      let costo = 0;
      ingredientesProducto &&
        ingredientesProducto.map(
          (ing) =>
            ing.ingrediente !== '' &&
            (costo =
              costo + ing.cantidad * ing.ingrediente.precioCostoIngrediente)
        );
      setCostoProducto(costo);
    };
    calcularCosto();
  }, [ingredientesProducto]);

  function getRubros() {
    return axios.get(`/api/rubros`);
  }

  function getIngredientesDB() {
    return axios.get(`/api/ingredientes`);
  }

  /* const updateIngredient = (ingredientObj) => {
    const updatedIngredients = ingredientesProducto.map((ingredient) => {
      if (ingredient.listId === ingredientObj.listId) {
        return ingredientObj;
      }
      return ingredient;
    });
    setIngredientesProducto(updatedIngredients);
  };

  const removeIngredient = (ingredientObj) => {
    const updatedIngredients = ingredientesProducto.filter(
      (ingredient) => ingredient.listId !== ingredientObj.listId
    );
    setIngredientesProducto(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredientesProducto([
      ...ingredientesProducto,
      {
        listId: listId,
        ingredient_id: 0,
        cantidad: 0,
        unidadDeMedidaIngrediente: '',
      },
    ]);
    setListId(listId + 1);
  };

  const renderIngredients = ingredientesProducto.map((ingredienteProducto) => (
    <AddIngredient
      key={ingredienteProducto.listId}
      ingredienteProducto={ingredienteProducto}
      ingredientes={ingredientesDB}
      listId={listId - 1}
      updateIngredient={updateIngredient}
      removeIngredient={removeIngredient}
    />
  )); */

  /* const calcularCosto = () => {
    setCostoProducto(0);
    let costo = 0;
    ingredientesProducto &&
      ingredientesProducto.map(
        (ing) =>
          (costo =
            costo + ing.cantidad * ing.ingrediente.precioCostoIngrediente)

      );
    setCostoProducto(costo);
  }; */

  const addIngredient = () => {
    setIngredientesProducto([
      ...ingredientesProducto,
      {
        ingrediente: '',
        cantidad: 0,
      },
    ]);
  };

  const removeIngredient = (index) => {
    const rows = [...ingredientesProducto];
    rows.splice(index, 1);
    setIngredientesProducto(rows);
    //localStorage.setItem('ingredientesProducto', JSON.stringify(rows));
    //calcularCosto();
  };

  const handleChange = (index, e) => {
    const name = e.target.name;
    const value = e.target.value;
    const list = [...ingredientesProducto];
    name === 'cantidad'
      ? (list[index][name] = parseFloat(value))
      : (list[index][name] = value);
    setIngredientesProducto(list);
    //calcularCosto();

    //console.log("e: " + e)
    //console.log("e.target: " + e.target)
    ////const { name, value } = e.target;
    //console.log(value)
    //console.log(e.target)
    ////const list = [...ingredientesProducto];
    ////list[index][name] = value;
    ////setIngredientesProducto(list);
    //localStorage.setItem('ingredientesProducto', JSON.stringify(list));
    //console.log(list)
    //console.log(typeof(list))
    console.log(ingredientesProducto);
  };

  function deleteLocalStorage() {
    let userInfo = localStorage.getItem('userInfo');
    /* localStorage.removeItem('nombreProducto')
    localStorage.removeItem('tiempoCocinaProducto') 
    localStorage.removeItem('recetaProducto')
    localStorage.removeItem('descripcionProducto')
    localStorage.removeItem('imagenProducto')
    localStorage.removeItem('precioVentaProducto')
    localStorage.removeItem('altaProducto')
    localStorage.removeItem('isVegetariano') 
    localStorage.removeItem('isCeliaco')
    localStorage.removeItem('rubroProducto')
    localStorage.removeItem('stockProducto') */
    localStorage.clear();
    localStorage.setItem('userInfo', userInfo);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/productos`,
        {
          nombreProducto,
          tiempoCocinaProducto,
          recetaProducto,
          descripcionProducto,
          imagenProducto,
          precioVentaProducto,
          altaProducto,
          rubroProducto,
          //stockProducto,
          isCeliaco,
          isVegetariano,
          ingredientesProducto,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Producto creado!');
      deleteLocalStorage();
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
      deleteLocalStorage();
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      toast.success('Imagen subida correctamente!');
      setImagenProducto(data.secure_url);
      localStorage.setItem('imagenProducto', data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Crear producto</title>
      </Helmet>
      <h1>Crear producto </h1>

      <Form onSubmit={submitHandler}>
        <TextField
          inputProps={{ maxLength: 40 }}
          className="mb-3"
          fullWidth
          required
          id="nombreProducto"
          label="Nombre"
          value={nombreProducto}
          onChange={(e) => {
            setNombreProducto(e.target.value);
            localStorage.setItem('nombreProducto', e.target.value);
          }}
        />
        {/*<Form.Group className="mb-3" controlId="nombreProducto"> 
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={nombreProducto}
            onChange={(e) => {
              setNombreProducto(e.target.value);
              localStorage.setItem('nombreProducto', e.target.value);
            }}
            required
          ></Form.Control> </Form.Group>*/}

        <TextField
          className="mb-3"
          fullWidth
          id="descripcionProducto"
          label="Descripción"
          value={descripcionProducto}
          onChange={(e) => {
            setDescripcionProducto(e.target.value);
            localStorage.setItem('descripcionProducto', e.target.value);
          }}
        />
        {/* <Form.Group className="mb-3" controlId="descripcionProducto">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            value={descripcionProducto}
            onChange={(e) => {
              setDescripcionProducto(e.target.value);
              localStorage.setItem('descripcionProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group> */}

        <TextField
          className="mb-3"
          fullWidth
          multiline
          rows={4}
          id="recetaProducto"
          label="Receta"
          value={recetaProducto}
          onChange={(e) => {
            setRecetaProducto(e.target.value);
            localStorage.setItem('recetaProducto', e.target.value);
          }}
        />

        {/*  <Form.Group className="mb-3" controlId="recetaProducto">
          <Form.Label>Receta</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={recetaProducto}
            onChange={(e) => {
              setRecetaProducto(e.target.value);
              localStorage.setItem('recetaProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group> */}

        {/* <Form.Group className="mb-3" controlId="ingredientes">
          <Form.Label>Ingredientes</Form.Label>
          <Row>
            <Col>Ingrediente</Col>
            <Col>Cantidad</Col>
            <Col>Unidad</Col>
            <Col>Borrar</Col>
          </Row>
          <Row>{renderIngredients}</Row>
          <Row>
            <Button variant="warning" onClick={addIngredient}>
              Agregar ingrediente
            </Button>
          </Row>
        </Form.Group> */}

        {/*         <Form.Group className="mb-3" controlId="ingredientes">
        <Form.Label>Ingredientes</Form.Label>
          <Row>
            <Col>Ingrediente</Col>
            <Col>Cantidad</Col>
            <Col>Unidad</Col>
            <Col>Borrar</Col>
          </Row>

            {ingredientesProducto.map((ingProd)=> (
              <Col>
              <Select
                defaultValue={
                   { label: ingProd }
                    
                }
                options={ingredientesDB.map((ing) => ({
                  label: ing.nombreIngrediente,
                  value: ing.nombreIngrediente,
                }))}
                onChange={(e) => {
                  updateIngredient(ingProd)
                }}
              ></Select>
            </Col>
            ))
            }

          <Row>
            <Col>
              <Select
                defaultValue={
                  rubroProducto
                    ? { label: rubroProducto }
                    : { label: 'Seleccionar ingrediente' }
                }
                options={ingredientesDB.map((ing) => ({
                  label: ing.nombreIngrediente,
                  value: ing.nombreIngrediente,
                }))}
                onChange={(e) => {
                  setRubroProducto(e.value);
                  localStorage.setItem('rubroProducto', e.value);
                }}
              ></Select>
            </Col>
            <Col>
            
          <Form.Control
            className="smaller-input"
            type="Number"
            min="0"
            value={tiempoCocinaProducto}
            onChange={(e) => {
              setTiempoCocinaProducto(e.target.value);
              localStorage.setItem('tiempoCocinaProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Col>
        <Col>
        gr
        </Col>
            <Col>
              
              <Button
                type="button"
                onClick={() => navigate(`/borraringrediente`)}
              >
                x
              </Button>
            </Col>
          </Row>
        </Form.Group> */}

        <TextField
          required
          InputProps={{ inputProps: { min: 0 } }}
          id="tiempoCocinaProducto"
          label="Tiempo de cocina (mins)"
          value={tiempoCocinaProducto || ''}
          className="medium-small-input mb-3"
          type="Number"
          //min="0"
          onChange={(e) => {
            setTiempoCocinaProducto(e.target.value);
            localStorage.setItem('tiempoCocinaProducto', e.target.value);
          }}
        />

        {/* <Form.Group className="mb-3" controlId="tiempoCocinaProducto">
          <Form.Label>Tiempo de cocina</Form.Label>
          <Form.Control
            className="smaller-input"
            type="Number"
            min="0"
            value={tiempoCocinaProducto}
            onChange={(e) => {
              setTiempoCocinaProducto(e.target.value);
              localStorage.setItem('tiempoCocinaProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group> */}

        {/* <Form.Group className="mb-3" controlId="rubroProducto"> */}
        {/* <Form.Label>Rubro</Form.Label> */}
        {/* <Form.Label>Rubro</Form.Label> */}
        {/* <Form.Control
            value={rubroProducto}
            onChange={(e) => setRubroProducto(e.target.value)}
            required
          ></Form.Control> */}
        {/* <Form.Select>
            {rubros.map((rubro) => (
              <option key={rubro._id} value={rubro.nombreRubro}>{rubro.nombreRubro}</option>
            ))}

            
          </Form.Select> */}

        <Row>
          <Col>
            <TextField
              className="medium-large-input mb-3"
              required
              id="rubroProducto"
              select
              label="Seleccionar rubro"
              value={rubroProducto}
              onChange={(e) => {
                setRubroProducto(e.target.value);
                localStorage.setItem('rubroProducto', e.target.value);
              }}
            >
              {rubros.map((rubro) => (
                <MenuItem key={rubro.nombreRubro} value={rubro.nombreRubro}>
                  {rubro.nombreRubro}
                </MenuItem>
              ))}
            </TextField>

            {/* <Select
                defaultValue={
                  rubroProducto
                    ? { label: rubroProducto }
                    : { label: 'Seleccionar rubro' }
                }
                options={rubros.map((rubro) => ({
                  label: rubro.nombreRubro,
                  value: rubro.nombreRubro,
                }))}
                onChange={(e) => {
                  setRubroProducto(e.value);
                  localStorage.setItem('rubroProducto', e.value);
                }}
              ></Select> */}
          </Col>
          <Col className="d-flex align-items-center mb-3">
            ¿No está el rubro? &rArr; &nbsp;
            <Button type="button" onClick={() => navigate(`/admin/rubro/new`)}>
              Crear rubro
            </Button>
          </Col>
        </Row>
        {/* </Form.Group> */}

        {/* <Form.Group className="mb-3" controlId="rubroProducto">
          <Form.Label>Rubro</Form.Label>
           

          <Combobox
            data={rubros}
            dataKey="_id"
            textField="nombreRubro"
            placeholder="Seleccionar rubro"
          ></Combobox>
        </Form.Group> */}

        {/* {rubros.map((rubro) => (
                <tr key={rubro._id}>
                  <td>{rubro._id}</td>
                  <td>{rubro.nombreRubro}</td>
                  <td>{rubro.altaRubro.toString()}</td>
                  
                </tr>
              ))} */}

        {/* <Form.Group className="mb-3" controlId="imagenProducto">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            value={imagenProducto}
            onChange={(e) => {
              setImagenProducto(e.target.value);
              localStorage.setItem('imagenProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group> */}

        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Subir imagen</Form.Label>
          <Form.Control type="file" onChange={uploadFileHandler}></Form.Control>
          {loadingUpload && <LoadingBox></LoadingBox>}
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="precioVentaProducto">
          <Form.Label>Precio de venta</Form.Label>
          <Form.Control
            className="smaller-input"
            type="Number"
            min="0"
            value={precioVentaProducto}
            onChange={(e) => {
              setPrecioVentaProducto(e.target.value);
              localStorage.setItem('precioVentaProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group> */}

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="altaProducto"
          label="Está dado de alta?"
          checked={altaProducto}
          onChange={(e) => {
            setAltaProducto(e.target.checked);
            localStorage.setItem('altaProducto', e.target.checked);
          }}
        ></Form.Check>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="isVegetariano"
          label="Vegetariano?"
          checked={isVegetariano}
          onChange={(e) => {
            setIsVegetariano(e.target.checked);
            localStorage.setItem('isVegetariano', e.target.checked);
          }}
        ></Form.Check>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="isCeliaco"
          label="Apto celíacos?"
          checked={isCeliaco}
          onChange={(e) => {
            setIsCeliaco(e.target.checked);
            localStorage.setItem('isCeliaco', e.target.checked);
          }}
        ></Form.Check>

        {/* <Form.Group className="mb-3" controlId="stockProducto">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="Number"
            min="0"
            value={stockProducto}
            onChange={(e) => {
              setStockProducto(e.target.value);
              localStorage.setItem('stockProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group> */}

        <Container className="mt-3 square border border-dark mb-3">
          <h2 className="text-center">Ingredientes</h2>
          <Row>
            {ingredientesProducto.map((data, index) => {
              return (
                <Row className="row my-3" key={index}>
                  <Col>
                    <TextField
                      className="medium-input mb-3"
                      required
                      id="ingrediente"
                      name="ingrediente"
                      select
                      label="Seleccionar ingrediente"
                      value={data.ingrediente}
                      onChange={(e) => handleChange(index, e)}
                    >
                      {ingredientesDB.map(
                        (
                          ingrediente //ver si causa conflicto que se llame ingrediente
                        ) => (
                          <MenuItem
                            key={ingrediente.nombreIngrediente}
                            value={ingrediente}
                          >
                            {ingrediente.nombreIngrediente}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Col>

                  <Col>
                    <TextField
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      required
                      min="0"
                      id="cantidad"
                      label="cantidad"
                      value={data.cantidad}
                      className="small-input mb-3"
                      name="cantidad"
                      type="number"
                      //min="0"
                      onChange={(e) => handleChange(index, e)}
                    />
                  </Col>
                  <Col>
                    {data.ingrediente && (
                      <TextField
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          border: 'none',
                          '& fieldset': { border: 'none' },
                        }}
                        id="unidad"
                        label="unidad"
                        value={
                          data.ingrediente &&
                          data.ingrediente.unidadDeMedidaIngrediente
                        }
                        className="extra-small-input mb-3"
                      />
                    )}
                  </Col>
                  <Col className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => removeIngredient(index)}
                    >
                      x
                    </button>
                  </Col>
                </Row>
              );
            })}

            <Row>
              <Button
                variant="warning"
                onClick={addIngredient}
                className="mb-3"
              >
                Agregar ingrediente
              </Button>
            </Row>
          </Row>
        </Container>

        <Row>
          <Col>
            <TextField
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              required
              id="precioVentaProducto"
              label="Precio de venta"
              value={precioVentaProducto || ''}
              className="medium-input mb-3"
              type="Number"
              //min="0"
              onChange={(e) => {
                setPrecioVentaProducto(e.target.value);
                localStorage.setItem('precioVentaProducto', e.target.value);
              }}
            />
          </Col>
          <Col>
            <TextField
              sx={{ border: 'none', '& fieldset': { border: 'none' } }}
              id="costoProducto"
              label="Costo del producto"
              value={costoProducto || ''}
              className="medium-input mb-3"
              type="Number"
              InputProps={{
                readOnly: true,
              }}
            />
          </Col>
        </Row>

        <div className="mb-3">
          <Button disabled={loadingCreate || loadingUpload} type="submit">
            Crear producto
          </Button>
          {loadingCreate && <LoadingBox></LoadingBox>}{' '}
          <Button
            type="button"
            onClick={() => {
              deleteLocalStorage();
              navigate(`/admin/products`);
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
