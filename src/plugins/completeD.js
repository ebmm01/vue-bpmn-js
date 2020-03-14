export default {
    "declaration": {
        "attributes": {
            "version": "1.0",
            "encoding": "UTF-8"
        }
    },
    "elements": [
        {
            "type": "element",
            "name": "bpmn:definitions",
            "attributes": {
                "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
                "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
                "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
                "id": "Definitions_0717aml",
                "targetNamespace": "http://bpmn.io/schema/bpmn",
                "exporter": "bpmn-js (https://demo.bpmn.io)",
                "exporterVersion": "6.3.1"
            },
            "elements": [
                {
                    "type": "element",
                    "name": "bpmn:process",
                    "attributes": {
                        "id": "Process_14kdvgu",
                        "isExecutable": "false"
                    },
                    "elements": [
                        {
                            "type": "element",
                            "name": "bpmn:task",
                            "attributes": {
                                "id": "Activity_0z905bp"
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "bpmn:outgoing",
                                    "elements": [
                                        {
                                            "type": "text",
                                            "text": "Flow_1n4zyb0"
                                        }
                                    ]
                                },
                                {
                                    "type": "element",
                                    "name": "bpmn:outgoing",
                                    "elements": [
                                        {
                                            "type": "text",
                                            "text": "Flow_117en6h"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "bpmn:task",
                            "attributes": {
                                "id": "Activity_0sm5sfi"
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "bpmn:incoming",
                                    "elements": [
                                        {
                                            "type": "text",
                                            "text": "Flow_1n4zyb0"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "bpmn:task",
                            "attributes": {
                                "id": "Activity_1ie6un3"
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "bpmn:incoming",
                                    "elements": [
                                        {
                                            "type": "text",
                                            "text": "Flow_117en6h"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "bpmn:sequenceFlow",
                            "attributes": {
                                "id": "Flow_1n4zyb0",
                                "sourceRef": "Activity_0z905bp",
                                "targetRef": "Activity_0sm5sfi"
                            }
                        },
                        {
                            "type": "element",
                            "name": "bpmn:sequenceFlow",
                            "attributes": {
                                "id": "Flow_117en6h",
                                "sourceRef": "Activity_0z905bp",
                                "targetRef": "Activity_1ie6un3"
                            }
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "bpmndi:BPMNDiagram",
                    "attributes": {
                        "id": "BPMNDiagram_1"
                    },
                    "elements": [
                        {
                            "type": "element",
                            "name": "bpmndi:BPMNPlane",
                            "attributes": {
                                "id": "BPMNPlane_1",
                                "bpmnElement": "Process_14kdvgu"
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "bpmndi:BPMNShape",
                                    "attributes": {
                                        "id": "Activity_0z905bp_di",
                                        "bpmnElement": "Activity_0z905bp"
                                    },
                                    "elements": [
                                        {
                                            "type": "element",
                                            "name": "dc:Bounds",
                                            "attributes": {
                                                "x": "280",
                                                "y": "290",
                                                "width": "100",
                                                "height": "80"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "element",
                                    "name": "bpmndi:BPMNShape",
                                    "attributes": {
                                        "id": "Activity_0sm5sfi_di",
                                        "bpmnElement": "Activity_0sm5sfi"
                                    },
                                    "elements": [
                                        {
                                            "type": "element",
                                            "name": "dc:Bounds",
                                            "attributes": {
                                                "x": "620",
                                                "y": "250",
                                                "width": "100",
                                                "height": "80"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "element",
                                    "name": "bpmndi:BPMNShape",
                                    "attributes": {
                                        "id": "Activity_1ie6un3_di",
                                        "bpmnElement": "Activity_1ie6un3"
                                    },
                                    "elements": [
                                        {
                                            "type": "element",
                                            "name": "dc:Bounds",
                                            "attributes": {
                                                "x": "620",
                                                "y": "440",
                                                "width": "100",
                                                "height": "80"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "element",
                                    "name": "bpmndi:BPMNEdge",
                                    "attributes": {
                                        "id": "Flow_1n4zyb0_di",
                                        "bpmnElement": "Flow_1n4zyb0"
                                    },
                                    "elements": [
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "380",
                                                "y": "330"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "500",
                                                "y": "330"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "500",
                                                "y": "290"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "620",
                                                "y": "290"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "element",
                                    "name": "bpmndi:BPMNEdge",
                                    "attributes": {
                                        "id": "Flow_117en6h_di",
                                        "bpmnElement": "Flow_117en6h"
                                    },
                                    "elements": [
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "380",
                                                "y": "330"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "500",
                                                "y": "330"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "500",
                                                "y": "480"
                                            }
                                        },
                                        {
                                            "type": "element",
                                            "name": "di:waypoint",
                                            "attributes": {
                                                "x": "620",
                                                "y": "480"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}