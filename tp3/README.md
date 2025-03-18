# CG 2024/2025

## Group T04G06

## TP 3 Notes

In this practical assignment, we learned how to define an object's **normals**, thus changing how it interacts with the light sources. In addition, we also learned how to apply **materials** to change an object's color.

- In exercise 1, we updated the [unit cube](objects/solids/MyUnitCube.js) by defining its normals. Considering each normal is mapped to a vertex and each vertex belongs to three faces, we had to repeat the vertices three times. Then, we created a new wooden material and applied it. Finally, we created new materials to color each of the [tangram](objects/MyTangram.js) pieces.

| ![Figure 1](screenshots/cg-t04g06-tp3-1.png) |
| :------------------------------------------: |
| **Figure 1:** A cube with a wooden material  |

| ![Figure 2](screenshots/cg-t04g06-tp3-2.png) |
| :------------------------------------------: |
|           **Figure 2:** A tangram            |

- In exercises 2 and 3, we created two new solids: a [prism](objects/solids/MyPrism.js) and a [cylinder](objects/solids/MyCylinder.js), respectively. Both of these feature a customizable number of **slices** (divisions around the Z-axis) and **stacks** (divisions along the Z-axis). Despite having identical geometries (i.e. vertices and indices), these objects look very different when illuminated because their normals are distinct.

| ![Figure 3](screenshots/cg-t04g06-tp3-3.png) |
| :------------------------------------------: |
|            **Figure 3:** A prism             |

| ![Figure 4](screenshots/cg-t04g06-tp3-4.png) |
| :------------------------------------------: |
|           **Figure 4:** A cylinder           |
