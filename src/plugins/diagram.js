export default {
    "_declaration": {
        "_attributes": {
            "version": "1.0",
            "encoding": "UTF-8"
        }
    },
    "bpmn:definitions": {
        "_attributes": {
            "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
            "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
            "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
            "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
            "id": "Definitions_0717aml",
            "targetNamespace": "http://bpmn.io/schema/bpmn",
            "exporter": "bpmn-js (https://demo.bpmn.io)",
            "exporterVersion": "6.3.1"
        },
        "bpmn:process": {
            "_attributes": {
                "id": "Process_14kdvgu",
                "isExecutable": "false"
            },
            "bpmn:task": [
                {
                    "_attributes": {
                        "id": "Activity_01njp6z",
                        "name": "Inicio"
                    },
                    "bpmn:outgoing": {
                        "_text": "Flow_1qktbh8"
                    }
                },
                {
                    "_attributes": {
                        "id": "Activity_0ty0jgg",
                        "name": "Coleta dados"
                    },
                    "bpmn:incoming": {
                        "_text": "Flow_1qktbh8"
                    },
                    "bpmn:outgoing": [
                        {
                            "_text": "Flow_0hklxk9"
                        },
                        {
                            "_text": "Flow_1376l92"
                        }
                    ]
                },
                {
                    "_attributes": {
                        "id": "Activity_02dbnig",
                        "name": "Erro"
                    },
                    "bpmn:incoming": {
                        "_text": "Flow_1376l92"
                    }
                },
                {
                    "_attributes": {
                        "id": "Activity_1e6u2f3",
                        "name": "Sucesso"
                    },
                    "bpmn:incoming": {
                        "_text": "Flow_0hklxk9"
                    }
                }
            ],
            "bpmn:sequenceFlow": [
                {
                    "_attributes": {
                        "id": "Flow_0hklxk9",
                        "name": "tipo === true",
                        "sourceRef": "Activity_0ty0jgg",
                        "targetRef": "Activity_1e6u2f3"
                    }
                },
                {
                    "_attributes": {
                        "id": "Flow_1376l92",
                        "name": "tipo === false",
                        "sourceRef": "Activity_0ty0jgg",
                        "targetRef": "Activity_02dbnig"
                    }
                },
                {
                    "_attributes": {
                        "id": "Flow_1qktbh8",
                        "sourceRef": "Activity_01njp6z",
                        "targetRef": "Activity_0ty0jgg"
                    }
                }
            ]
        },
        "bpmndi:BPMNDiagram": {
            "_attributes": {
                "id": "BPMNDiagram_1"
            },
            "bpmndi:BPMNPlane": {
                "_attributes": {
                    "id": "BPMNPlane_1",
                    "bpmnElement": "Process_14kdvgu"
                },
                "bpmndi:BPMNShape": [
                    {
                        "_attributes": {
                            "id": "Activity_01njp6z_di",
                            "bpmnElement": "Activity_01njp6z"
                        },
                        "dc:Bounds": {
                            "_attributes": {
                                "x": "210",
                                "y": "350",
                                "width": "100",
                                "height": "80"
                            }
                        }
                    },
                    {
                        "_attributes": {
                            "id": "Activity_0ty0jgg_di",
                            "bpmnElement": "Activity_0ty0jgg"
                        },
                        "dc:Bounds": {
                            "_attributes": {
                                "x": "460",
                                "y": "350",
                                "width": "100",
                                "height": "80"
                            }
                        }
                    },
                    {
                        "_attributes": {
                            "id": "Activity_02dbnig_di",
                            "bpmnElement": "Activity_02dbnig"
                        },
                        "dc:Bounds": {
                            "_attributes": {
                                "x": "730",
                                "y": "250",
                                "width": "100",
                                "height": "80"
                            }
                        }
                    },
                    {
                        "_attributes": {
                            "id": "Activity_1e6u2f3_di",
                            "bpmnElement": "Activity_1e6u2f3"
                        },
                        "dc:Bounds": {
                            "_attributes": {
                                "x": "730",
                                "y": "460",
                                "width": "100",
                                "height": "80"
                            }
                        }
                    }
                ],
                "bpmndi:BPMNEdge": [
                    {
                        "_attributes": {
                            "id": "Flow_0hklxk9_di",
                            "bpmnElement": "Flow_0hklxk9"
                        },
                        "di:waypoint": [
                            {
                                "_attributes": {
                                    "x": "560",
                                    "y": "390"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "645",
                                    "y": "390"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "645",
                                    "y": "500"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "730",
                                    "y": "500"
                                }
                            }
                        ],
                        "bpmndi:BPMNLabel": {
                            "dc:Bounds": {
                                "_attributes": {
                                    "x": "648",
                                    "y": "513",
                                    "width": "63",
                                    "height": "14"
                                }
                            }
                        }
                    },
                    {
                        "_attributes": {
                            "id": "Flow_1376l92_di",
                            "bpmnElement": "Flow_1376l92"
                        },
                        "di:waypoint": [
                            {
                                "_attributes": {
                                    "x": "560",
                                    "y": "390"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "645",
                                    "y": "390"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "645",
                                    "y": "290"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "730",
                                    "y": "290"
                                }
                            }
                        ],
                        "bpmndi:BPMNLabel": {
                            "dc:Bounds": {
                                "_attributes": {
                                    "x": "646",
                                    "y": "273",
                                    "width": "67",
                                    "height": "14"
                                }
                            }
                        }
                    },
                    {
                        "_attributes": {
                            "id": "Flow_1qktbh8_di",
                            "bpmnElement": "Flow_1qktbh8"
                        },
                        "di:waypoint": [
                            {
                                "_attributes": {
                                    "x": "310",
                                    "y": "390"
                                }
                            },
                            {
                                "_attributes": {
                                    "x": "460",
                                    "y": "390"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
}