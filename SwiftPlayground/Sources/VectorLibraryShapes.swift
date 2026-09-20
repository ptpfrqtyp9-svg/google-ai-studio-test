import SwiftUI

// MARK: - 1. Five-Pointed Star Shape
public struct StarShape: Shape {
    public let points: Int = 5
    public let innerRatio: CGFloat = 0.45
    
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let outerRadius = min(rect.width, rect.height) / 2.0 * 0.9
        let innerRadius = outerRadius * innerRatio
        let step = .pi / CGFloat(points)
        
        var angle: CGFloat = -.pi / 2.0
        
        for i in 0..<(points * 2) {
            let radius = i.isMultiple(of: 2) ? outerRadius : innerRadius
            let x = center.x + cos(angle) * radius
            let y = center.y + sin(angle) * radius
            
            if i == 0 {
                path.move(to: CGPoint(x: x, y: y))
            } else {
                path.addLine(to: CGPoint(x: x, y: y))
            }
            angle += step
        }
        path.closeSubpath()
        return path
    }
}

// MARK: - 2. Cat Silhouette Shape
public struct CatShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Head & Body Contour
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.28))
        path.addLine(to: CGPoint(x: w * 0.65, y: h * 0.28))
        path.addLine(to: CGPoint(x: w * 0.78, y: h * 0.12))
        path.addLine(to: CGPoint(x: w * 0.76, y: h * 0.38))
        path.addQuadCurve(to: CGPoint(x: w * 0.72, y: h * 0.56), control: CGPoint(x: w * 0.85, y: h * 0.46))
        path.addQuadCurve(to: CGPoint(x: w * 0.75, y: h * 0.85), control: CGPoint(x: w * 0.82, y: h * 0.72))
        path.addQuadCurve(to: CGPoint(x: w * 0.25, y: h * 0.85), control: CGPoint(x: w * 0.5, y: h * 0.90))
        path.addQuadCurve(to: CGPoint(x: w * 0.28, y: h * 0.56), control: CGPoint(x: w * 0.18, y: h * 0.72))
        path.addQuadCurve(to: CGPoint(x: w * 0.24, y: h * 0.38), control: CGPoint(x: w * 0.15, y: h * 0.46))
        path.addLine(to: CGPoint(x: w * 0.22, y: h * 0.12))
        path.addLine(to: CGPoint(x: w * 0.35, y: h * 0.28))
        path.closeSubpath()
        
        // Eyes
        path.addEllipse(in: CGRect(x: w * 0.36, y: h * 0.41, width: w * 0.07, height: h * 0.09))
        path.addEllipse(in: CGRect(x: w * 0.57, y: h * 0.41, width: w * 0.07, height: h * 0.09))
        
        // Whiskers
        path.move(to: CGPoint(x: w * 0.35, y: h * 0.52))
        path.addLine(to: CGPoint(x: w * 0.18, y: h * 0.49))
        path.move(to: CGPoint(x: w * 0.35, y: h * 0.55))
        path.addLine(to: CGPoint(x: w * 0.18, y: h * 0.57))
        path.move(to: CGPoint(x: w * 0.65, y: h * 0.52))
        path.addLine(to: CGPoint(x: w * 0.82, y: h * 0.49))
        path.move(to: CGPoint(x: w * 0.65, y: h * 0.55))
        path.addLine(to: CGPoint(x: w * 0.82, y: h * 0.57))
        
        return path
    }
}

// MARK: - 3. Cardioid Heart Shape
public struct HeartShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.85))
        path.addCurve(
            to: CGPoint(x: w * 0.05, y: h * 0.35),
            control1: CGPoint(x: w * 0.30, y: h * 0.70),
            control2: CGPoint(x: w * 0.05, y: h * 0.55)
        )
        path.addArc(
            center: CGPoint(x: w * 0.28, y: h * 0.32),
            radius: w * 0.23,
            startAngle: .degrees(180),
            endAngle: .degrees(0),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: w * 0.5, y: h * 0.38))
        path.addArc(
            center: CGPoint(x: w * 0.72, y: h * 0.32),
            radius: w * 0.23,
            startAngle: .degrees(180),
            endAngle: .degrees(0),
            clockwise: false
        )
        path.addCurve(
            to: CGPoint(x: w * 0.5, y: h * 0.85),
            control1: CGPoint(x: w * 0.95, y: h * 0.55),
            control2: CGPoint(x: w * 0.70, y: h * 0.70)
        )
        path.closeSubpath()
        return path
    }
}

// MARK: - 4. Car Silhouette Shape
public struct CarShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        path.move(to: CGPoint(x: w * 0.08, y: h * 0.65))
        path.addLine(to: CGPoint(x: w * 0.08, y: h * 0.55))
        path.addQuadCurve(to: CGPoint(x: w * 0.20, y: h * 0.50), control: CGPoint(x: w * 0.08, y: h * 0.50))
        path.addLine(to: CGPoint(x: w * 0.30, y: h * 0.50))
        path.addLine(to: CGPoint(x: w * 0.42, y: h * 0.30))
        path.addLine(to: CGPoint(x: w * 0.70, y: h * 0.30))
        path.addLine(to: CGPoint(x: w * 0.82, y: h * 0.50))
        path.addLine(to: CGPoint(x: w * 0.92, y: h * 0.52))
        path.addQuadCurve(to: CGPoint(x: w * 0.94, y: h * 0.65), control: CGPoint(x: w * 0.94, y: h * 0.58))
        
        path.addLine(to: CGPoint(x: w * 0.84, y: h * 0.65))
        path.addArc(center: CGPoint(x: w * 0.74, y: h * 0.65), radius: w * 0.09, startAngle: .degrees(0), endAngle: .degrees(180), clockwise: true)
        path.addLine(to: CGPoint(x: w * 0.38, y: h * 0.65))
        path.addArc(center: CGPoint(x: w * 0.28, y: h * 0.65), radius: w * 0.09, startAngle: .degrees(0), endAngle: .degrees(180), clockwise: true)
        path.closeSubpath()
        
        path.addEllipse(in: CGRect(x: w * 0.21, y: h * 0.58, width: w * 0.14, height: w * 0.14))
        path.addEllipse(in: CGRect(x: w * 0.67, y: h * 0.58, width: w * 0.14, height: w * 0.14))
        
        return path
    }
}

// MARK: - 5. Eight-Petal Botanical Flower Shape
public struct FlowerShape: Shape {
    public let petals: Int = 8
    
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let petalLength = min(rect.width, rect.height) * 0.38
        let petalWidth = petalLength * 0.42
        let step = (2.0 * .pi) / CGFloat(petals)
        
        for i in 0..<petals {
            let angle = CGFloat(i) * step
            let tipX = center.x + cos(angle) * petalLength
            let tipY = center.y + sin(angle) * petalLength
            let normalAngle = angle + .pi / 2.0
            
            let cp1X = center.x + cos(angle) * (petalLength * 0.6) + cos(normalAngle) * petalWidth
            let cp1Y = center.y + sin(angle) * (petalLength * 0.6) + sin(normalAngle) * petalWidth
            let cp2X = center.x + cos(angle) * (petalLength * 0.6) - cos(normalAngle) * petalWidth
            let cp2Y = center.y + sin(angle) * (petalLength * 0.6) - sin(normalAngle) * petalWidth
            
            path.move(to: center)
            path.addCurve(to: CGPoint(x: tipX, y: tipY), control1: CGPoint(x: cp1X, y: cp1Y), control2: CGPoint(x: cp1X, y: cp1Y))
            path.addCurve(to: center, control1: CGPoint(x: cp2X, y: cp2Y), control2: CGPoint(x: cp2X, y: cp2Y))
        }
        
        let centerRadius = petalLength * 0.28
        path.addEllipse(in: CGRect(x: center.x - centerRadius, y: center.y - centerRadius, width: centerRadius * 2.0, height: centerRadius * 2.0))
        return path
    }
}

// MARK: - 6. Majestic Lion Head Shape
public struct LionShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let w = rect.width
        let h = rect.height
        
        // 1. Radial Wavy Mane
        let maneCount = 16
        let outerR = min(w, h) * 0.45
        let innerR = outerR * 0.78
        for i in 0..<(maneCount * 2) {
            let r = i.isMultiple(of: 2) ? outerR : innerR
            let angle = CGFloat(i) * .pi / CGFloat(maneCount)
            let x = center.x + cos(angle) * r
            let y = center.y + sin(angle) * r
            if i == 0 {
                path.move(to: CGPoint(x: x, y: y))
            } else {
                path.addLine(to: CGPoint(x: x, y: y))
            }
        }
        path.closeSubpath()
        
        // 2. Ears
        path.addEllipse(in: CGRect(x: w * 0.24, y: h * 0.22, width: w * 0.16, height: h * 0.16))
        path.addEllipse(in: CGRect(x: w * 0.60, y: h * 0.22, width: w * 0.16, height: h * 0.16))
        
        // 3. Face Circle
        let faceR = min(w, h) * 0.26
        path.addEllipse(in: CGRect(x: center.x - faceR, y: center.y - faceR * 0.8, width: faceR * 2, height: faceR * 2))
        
        // 4. Eyes
        path.addEllipse(in: CGRect(x: w * 0.38, y: h * 0.44, width: w * 0.06, height: h * 0.08))
        path.addEllipse(in: CGRect(x: w * 0.56, y: h * 0.44, width: w * 0.06, height: h * 0.08))
        
        // 5. Nose & Mouth
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.60))
        path.addLine(to: CGPoint(x: w * 0.44, y: h * 0.53))
        path.addLine(to: CGPoint(x: w * 0.56, y: h * 0.53))
        path.closeSubpath()
        
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.60))
        path.addLine(to: CGPoint(x: w * 0.5, y: h * 0.64))
        path.addQuadCurve(to: CGPoint(x: w * 0.38, y: h * 0.63), control: CGPoint(x: w * 0.44, y: h * 0.68))
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.64))
        path.addQuadCurve(to: CGPoint(x: w * 0.62, y: h * 0.63), control: CGPoint(x: w * 0.56, y: h * 0.68))
        
        // Whiskers
        path.move(to: CGPoint(x: w * 0.36, y: h * 0.61))
        path.addLine(to: CGPoint(x: w * 0.22, y: h * 0.59))
        path.move(to: CGPoint(x: w * 0.36, y: h * 0.64))
        path.addLine(to: CGPoint(x: w * 0.21, y: h * 0.66))
        path.move(to: CGPoint(x: w * 0.64, y: h * 0.61))
        path.addLine(to: CGPoint(x: w * 0.78, y: h * 0.59))
        path.move(to: CGPoint(x: w * 0.64, y: h * 0.64))
        path.addLine(to: CGPoint(x: w * 0.79, y: h * 0.66))
        
        return path
    }
}

// MARK: - 7. Songbird Shape
public struct BirdShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Branch
        path.move(to: CGPoint(x: w * 0.12, y: h * 0.80))
        path.addQuadCurve(to: CGPoint(x: w * 0.88, y: h * 0.82), control: CGPoint(x: w * 0.45, y: h * 0.76))
        
        // Tail
        path.move(to: CGPoint(x: w * 0.26, y: h * 0.64))
        path.addLine(to: CGPoint(x: w * 0.08, y: h * 0.71))
        path.addLine(to: CGPoint(x: w * 0.16, y: h * 0.61))
        path.closeSubpath()
        
        // Bird Body & Head & Beak
        path.move(to: CGPoint(x: w * 0.30, y: h * 0.59))
        path.addCurve(
            to: CGPoint(x: w * 0.52, y: h * 0.24),
            control1: CGPoint(x: w * 0.25, y: h * 0.42),
            control2: CGPoint(x: w * 0.35, y: h * 0.24)
        )
        // Crown to beak
        path.addLine(to: CGPoint(x: w * 0.72, y: h * 0.36))
        path.addLine(to: CGPoint(x: w * 0.88, y: h * 0.39)) // Beak tip
        path.addLine(to: CGPoint(x: w * 0.72, y: h * 0.44))
        // Breast to belly
        path.addCurve(
            to: CGPoint(x: w * 0.50, y: h * 0.72),
            control1: CGPoint(x: w * 0.73, y: h * 0.56),
            control2: CGPoint(x: w * 0.68, y: h * 0.69)
        )
        path.addQuadCurve(to: CGPoint(x: w * 0.30, y: h * 0.59), control: CGPoint(x: w * 0.38, y: h * 0.74))
        
        // Wing
        path.move(to: CGPoint(x: w * 0.47, y: h * 0.42))
        path.addCurve(
            to: CGPoint(x: w * 0.36, y: h * 0.59),
            control1: CGPoint(x: w * 0.58, y: h * 0.42),
            control2: CGPoint(x: w * 0.58, y: h * 0.66)
        )
        path.addQuadCurve(to: CGPoint(x: w * 0.47, y: h * 0.42), control: CGPoint(x: w * 0.34, y: h * 0.51))
        
        // Eye
        path.addEllipse(in: CGRect(x: w * 0.63, y: h * 0.34, width: w * 0.04, height: h * 0.04))
        
        // Feet
        path.move(to: CGPoint(x: w * 0.45, y: h * 0.71))
        path.addLine(to: CGPoint(x: w * 0.45, y: h * 0.78))
        path.move(to: CGPoint(x: w * 0.52, y: h * 0.71))
        path.addLine(to: CGPoint(x: w * 0.52, y: h * 0.78))
        
        return path
    }
}

// MARK: - 8. Strawberry Shape
public struct StrawberryShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Stem
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.22))
        path.addQuadCurve(to: CGPoint(x: w * 0.58, y: h * 0.10), control: CGPoint(x: w * 0.52, y: h * 0.12))
        
        // Leaf Crown (Sepals)
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.25))
        path.addLine(to: CGPoint(x: w * 0.42, y: h * 0.18))
        path.addLine(to: CGPoint(x: w * 0.43, y: h * 0.26))
        path.addLine(to: CGPoint(x: w * 0.33, y: h * 0.23))
        path.addLine(to: CGPoint(x: w * 0.38, y: h * 0.30))
        path.addLine(to: CGPoint(x: w * 0.50, y: h * 0.27))
        path.addLine(to: CGPoint(x: w * 0.62, y: h * 0.30))
        path.addLine(to: CGPoint(x: w * 0.67, y: h * 0.23))
        path.addLine(to: CGPoint(x: w * 0.57, y: h * 0.26))
        path.addLine(to: CGPoint(x: w * 0.58, y: h * 0.18))
        path.closeSubpath()
        
        // Strawberry Body
        path.move(to: CGPoint(x: w * 0.32, y: h * 0.33))
        path.addCurve(
            to: CGPoint(x: w * 0.50, y: h * 0.88),
            control1: CGPoint(x: w * 0.18, y: h * 0.46),
            control2: CGPoint(x: w * 0.24, y: h * 0.71)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.68, y: h * 0.33),
            control1: CGPoint(x: w * 0.76, y: h * 0.71),
            control2: CGPoint(x: w * 0.82, y: h * 0.46)
        )
        path.addQuadCurve(to: CGPoint(x: w * 0.32, y: h * 0.33), control: CGPoint(x: w * 0.50, y: h * 0.26))
        
        // Seeds
        let seedLocations: [CGPoint] = [
            CGPoint(x: w * 0.39, y: h * 0.42),
            CGPoint(x: w * 0.50, y: h * 0.40),
            CGPoint(x: w * 0.61, y: h * 0.42),
            CGPoint(x: w * 0.34, y: h * 0.53),
            CGPoint(x: w * 0.45, y: h * 0.51),
            CGPoint(x: w * 0.55, y: h * 0.51),
            CGPoint(x: w * 0.66, y: h * 0.53),
            CGPoint(x: w * 0.39, y: h * 0.64),
            CGPoint(x: w * 0.50, y: h * 0.62),
            CGPoint(x: w * 0.61, y: h * 0.64),
            CGPoint(x: w * 0.45, y: h * 0.74),
            CGPoint(x: w * 0.55, y: h * 0.74)
        ]
        for seed in seedLocations {
            path.addEllipse(in: CGRect(x: seed.x - w * 0.012, y: seed.y - h * 0.02, width: w * 0.024, height: h * 0.04))
        }
        
        return path
    }
}

// MARK: - 9. Citrus Orange Shape
public struct OrangeShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let center = CGPoint(x: rect.midX, y: h * 0.56)
        let radius = min(w, h) * 0.33
        
        // Twig & Leaves
        path.move(to: CGPoint(x: center.x, y: h * 0.22))
        path.addLine(to: CGPoint(x: center.x, y: h * 0.15))
        // Leaf Right
        path.move(to: CGPoint(x: center.x, y: h * 0.17))
        path.addQuadCurve(to: CGPoint(x: center.x + w * 0.16, y: h * 0.16), control: CGPoint(x: center.x + w * 0.10, y: h * 0.10))
        path.addQuadCurve(to: CGPoint(x: center.x, y: h * 0.17), control: CGPoint(x: center.x + w * 0.10, y: h * 0.22))
        // Leaf Left
        path.move(to: CGPoint(x: center.x, y: h * 0.17))
        path.addQuadCurve(to: CGPoint(x: center.x - w * 0.16, y: h * 0.17), control: CGPoint(x: center.x - w * 0.10, y: h * 0.11))
        path.addQuadCurve(to: CGPoint(x: center.x, y: h * 0.17), control: CGPoint(x: center.x - w * 0.10, y: h * 0.22))
        
        // Orange Sphere
        path.addEllipse(in: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2))
        
        // Inner Segment Wheel
        let innerR = radius * 0.82
        path.addEllipse(in: CGRect(x: center.x - innerR, y: center.y - innerR, width: innerR * 2, height: innerR * 2))
        
        let centerPip = radius * 0.15
        path.addEllipse(in: CGRect(x: center.x - centerPip, y: center.y - centerPip, width: centerPip * 2, height: centerPip * 2))
        
        // Radial Segments (8 slices)
        for i in 0..<8 {
            let angle = CGFloat(i) * (.pi / 4.0)
            let x = center.x + cos(angle) * (innerR * 0.95)
            let y = center.y + sin(angle) * (innerR * 0.95)
            path.move(to: center)
            path.addLine(to: CGPoint(x: x, y: y))
        }
        
        return path
    }
}

// MARK: - 10. Watermelon Wedge Shape
public struct WatermelonShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Outer Rind Curve
        path.move(to: CGPoint(x: w * 0.10, y: h * 0.42))
        path.addLine(to: CGPoint(x: w * 0.90, y: h * 0.42))
        path.addCurve(
            to: CGPoint(x: w * 0.10, y: h * 0.42),
            control1: CGPoint(x: w * 0.84, y: h * 0.82),
            control2: CGPoint(x: w * 0.16, y: h * 0.82)
        )
        
        // Inner Pith Arc
        path.move(to: CGPoint(x: w * 0.14, y: h * 0.44))
        path.addCurve(
            to: CGPoint(x: w * 0.86, y: h * 0.44),
            control1: CGPoint(x: w * 0.20, y: h * 0.76),
            control2: CGPoint(x: w * 0.80, y: h * 0.76)
        )
        
        // Seeds
        let seeds: [CGPoint] = [
            CGPoint(x: w * 0.30, y: h * 0.52),
            CGPoint(x: w * 0.50, y: h * 0.50),
            CGPoint(x: w * 0.70, y: h * 0.52),
            CGPoint(x: w * 0.40, y: h * 0.60),
            CGPoint(x: w * 0.60, y: h * 0.60),
            CGPoint(x: w * 0.50, y: h * 0.68)
        ]
        for s in seeds {
            path.addEllipse(in: CGRect(x: s.x - w * 0.015, y: s.y - h * 0.025, width: w * 0.03, height: h * 0.05))
        }
        
        return path
    }
}

// MARK: - 11. Apple Shape
public struct AppleShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Stem
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.24))
        path.addQuadCurve(to: CGPoint(x: w * 0.58, y: h * 0.11), control: CGPoint(x: w * 0.53, y: h * 0.12))
        
        // Leaf
        path.move(to: CGPoint(x: w * 0.53, y: h * 0.18))
        path.addQuadCurve(to: CGPoint(x: w * 0.68, y: h * 0.18), control: CGPoint(x: w * 0.62, y: h * 0.11))
        path.addQuadCurve(to: CGPoint(x: w * 0.53, y: h * 0.18), control: CGPoint(x: w * 0.62, y: h * 0.25))
        
        // Apple Body with dimples
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.28))
        path.addCurve(
            to: CGPoint(x: w * 0.19, y: h * 0.46),
            control1: CGPoint(x: w * 0.42, y: h * 0.21),
            control2: CGPoint(x: w * 0.21, y: h * 0.24)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.45, y: h * 0.86),
            control1: CGPoint(x: w * 0.17, y: h * 0.68),
            control2: CGPoint(x: w * 0.34, y: h * 0.86)
        )
        // Bottom cleft
        path.addLine(to: CGPoint(x: w * 0.50, y: h * 0.84))
        path.addLine(to: CGPoint(x: w * 0.55, y: h * 0.86))
        path.addCurve(
            to: CGPoint(x: w * 0.81, y: h * 0.46),
            control1: CGPoint(x: w * 0.66, y: h * 0.86),
            control2: CGPoint(x: w * 0.83, y: h * 0.68)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.50, y: h * 0.28),
            control1: CGPoint(x: w * 0.79, y: h * 0.24),
            control2: CGPoint(x: w * 0.58, y: h * 0.21)
        )
        
        return path
    }
}

// MARK: - 12. Puffy Marshmallow Shape
public struct MarshmallowShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Skewer
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.08))
        path.addLine(to: CGPoint(x: w * 0.50, y: h * 0.24))
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.76))
        path.addLine(to: CGPoint(x: w * 0.50, y: h * 0.92))
        
        // Cylindrical Marshmallow
        let cylLeft = w * 0.26
        let cylRight = w * 0.74
        let topY = h * 0.35
        let bottomY = h * 0.65
        
        path.move(to: CGPoint(x: cylLeft, y: topY))
        path.addLine(to: CGPoint(x: cylLeft, y: bottomY))
        path.addQuadCurve(to: CGPoint(x: cylRight, y: bottomY), control: CGPoint(x: w * 0.50, y: bottomY + h * 0.11))
        path.addLine(to: CGPoint(x: cylRight, y: topY))
        path.addQuadCurve(to: CGPoint(x: cylLeft, y: topY), control: CGPoint(x: w * 0.50, y: topY - h * 0.11))
        
        // Top Cap Ellipse
        path.addEllipse(in: CGRect(x: cylLeft, y: topY - h * 0.11, width: cylRight - cylLeft, height: h * 0.22))
        
        // Kawaii Face
        path.addEllipse(in: CGRect(x: w * 0.40, y: h * 0.48, width: w * 0.04, height: h * 0.05))
        path.addEllipse(in: CGRect(x: w * 0.56, y: h * 0.48, width: w * 0.04, height: h * 0.05))
        
        // Smile
        path.move(to: CGPoint(x: w * 0.46, y: h * 0.56))
        path.addQuadCurve(to: CGPoint(x: w * 0.54, y: h * 0.56), control: CGPoint(x: w * 0.50, y: h * 0.61))
        
        return path
    }
}

// MARK: - 13. M&M's Chocolate Candy Shape
public struct MnMShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Back Candy
        path.addEllipse(in: CGRect(x: w * 0.44, y: h * 0.18, width: w * 0.44, height: h * 0.38))
        // Back "m"
        path.move(to: CGPoint(x: w * 0.60, y: h * 0.40))
        path.addLine(to: CGPoint(x: w * 0.60, y: h * 0.32))
        path.addQuadCurve(to: CGPoint(x: w * 0.66, y: h * 0.40), control: CGPoint(x: w * 0.63, y: h * 0.28))
        path.addQuadCurve(to: CGPoint(x: w * 0.72, y: h * 0.40), control: CGPoint(x: w * 0.69, y: h * 0.28))
        
        // Front Candy
        path.addEllipse(in: CGRect(x: w * 0.14, y: h * 0.36, width: w * 0.56, height: h * 0.48))
        
        // Front signature curved lowercase "m"
        let mLeft = w * 0.30
        path.move(to: CGPoint(x: mLeft, y: h * 0.64))
        path.addLine(to: CGPoint(x: mLeft, y: h * 0.52))
        path.addQuadCurve(to: CGPoint(x: mLeft + w * 0.09, y: h * 0.64), control: CGPoint(x: mLeft + w * 0.045, y: h * 0.46))
        path.addQuadCurve(to: CGPoint(x: mLeft + w * 0.18, y: h * 0.64), control: CGPoint(x: mLeft + w * 0.135, y: h * 0.46))
        
        return path
    }
}

// MARK: - 14. Swirled Lollipop Shape
public struct LollipopShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let center = CGPoint(x: rect.midX, y: h * 0.38)
        let discRadius = min(w, h) * 0.28
        
        // Stick
        path.move(to: CGPoint(x: center.x, y: center.y + discRadius))
        path.addLine(to: CGPoint(x: center.x, y: h * 0.92))
        
        // Ribbon Bow
        path.move(to: CGPoint(x: center.x, y: center.y + discRadius))
        path.addLine(to: CGPoint(x: center.x - w * 0.08, y: center.y + discRadius - h * 0.04))
        path.addQuadCurve(to: CGPoint(x: center.x, y: center.y + discRadius), control: CGPoint(x: center.x - w * 0.09, y: center.y + discRadius + h * 0.04))
        path.addLine(to: CGPoint(x: center.x + w * 0.08, y: center.y + discRadius - h * 0.04))
        path.addQuadCurve(to: CGPoint(x: center.x, y: center.y + discRadius), control: CGPoint(x: center.x + w * 0.09, y: center.y + discRadius + h * 0.04))
        
        // Outer Candy Disc
        path.addEllipse(in: CGRect(x: center.x - discRadius, y: center.y - discRadius, width: discRadius * 2, height: discRadius * 2))
        
        // Concentric / Swirl Arcs
        let rings = 4
        for r in 1...rings {
            let ringRadius = (discRadius / CGFloat(rings + 1)) * CGFloat(r)
            path.addEllipse(in: CGRect(x: center.x - ringRadius, y: center.y - ringRadius, width: ringRadius * 2, height: ringRadius * 2))
        }
        
        return path
    }
}

// MARK: - 15. Twist-Wrapped Hard Candy Shape
public struct WrappedCandyShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let center = CGPoint(x: rect.midX, y: rect.midY)
        
        // Left Twist
        path.move(to: CGPoint(x: w * 0.32, y: center.y))
        path.addLine(to: CGPoint(x: w * 0.12, y: h * 0.34))
        path.addQuadCurve(to: CGPoint(x: w * 0.12, y: h * 0.66), control: CGPoint(x: w * 0.15, y: center.y))
        path.closeSubpath()
        
        // Right Twist
        path.move(to: CGPoint(x: w * 0.68, y: center.y))
        path.addLine(to: CGPoint(x: w * 0.88, y: h * 0.34))
        path.addQuadCurve(to: CGPoint(x: w * 0.88, y: h * 0.66), control: CGPoint(x: w * 0.85, y: center.y))
        path.closeSubpath()
        
        // Candy Oval
        let ovalW = w * 0.40
        let ovalH = h * 0.32
        path.addEllipse(in: CGRect(x: center.x - ovalW / 2, y: center.y - ovalH / 2, width: ovalW, height: ovalH))
        
        // Stripes
        path.move(to: CGPoint(x: center.x - ovalW * 0.22, y: center.y - ovalH * 0.45))
        path.addQuadCurve(to: CGPoint(x: center.x - ovalW * 0.18, y: center.y + ovalH * 0.45), control: CGPoint(x: center.x - ovalW * 0.10, y: center.y))
        
        path.move(to: CGPoint(x: center.x + ovalW * 0.18, y: center.y - ovalH * 0.45))
        path.addQuadCurve(to: CGPoint(x: center.x + ovalW * 0.22, y: center.y + ovalH * 0.45), control: CGPoint(x: center.x + ovalW * 0.10, y: center.y))
        
        return path
    }
}

// MARK: - 16. Rocket Ship Shape
public struct RocketShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Fuselage & Nosecone
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.08))
        path.addQuadCurve(to: CGPoint(x: w * 0.68, y: h * 0.65), control: CGPoint(x: w * 0.72, y: h * 0.35))
        path.addLine(to: CGPoint(x: w * 0.32, y: h * 0.65))
        path.addQuadCurve(to: CGPoint(x: w * 0.5, y: h * 0.08), control: CGPoint(x: w * 0.28, y: h * 0.35))
        
        // Circular Viewport Window
        let winSize = min(w, h) * 0.16
        path.addEllipse(in: CGRect(x: w * 0.5 - winSize / 2, y: h * 0.32 - winSize / 2, width: winSize, height: winSize))
        
        // Left Fin
        path.move(to: CGPoint(x: w * 0.34, y: h * 0.52))
        path.addQuadCurve(to: CGPoint(x: w * 0.14, y: h * 0.78), control: CGPoint(x: w * 0.18, y: h * 0.62))
        path.addLine(to: CGPoint(x: w * 0.32, y: h * 0.65))
        
        // Right Fin
        path.move(to: CGPoint(x: w * 0.66, y: h * 0.52))
        path.addQuadCurve(to: CGPoint(x: w * 0.86, y: h * 0.78), control: CGPoint(x: w * 0.82, y: h * 0.62))
        path.addLine(to: CGPoint(x: w * 0.68, y: h * 0.65))
        
        // Thruster Nozzle
        path.move(to: CGPoint(x: w * 0.38, y: h * 0.65))
        path.addLine(to: CGPoint(x: w * 0.34, y: h * 0.75))
        path.addLine(to: CGPoint(x: w * 0.66, y: h * 0.75))
        path.addLine(to: CGPoint(x: w * 0.62, y: h * 0.65))
        
        return path
    }
}

// MARK: - 17. Saturn Planet Shape
public struct PlanetShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let planetRadius = min(w, h) * 0.26
        
        // Central Planet Sphere
        path.addEllipse(in: CGRect(x: center.x - planetRadius, y: center.y - planetRadius, width: planetRadius * 2, height: planetRadius * 2))
        
        // Outer Saturnian Ring
        let ringW = w * 0.88
        let ringH = h * 0.32
        let ringTransform = CGAffineTransform(translationX: center.x, y: center.y)
            .rotated(by: -.pi / 8.0)
            .translatedBy(x: -center.x, y: -center.y)
        
        var ringPath = Path()
        ringPath.addEllipse(in: CGRect(x: center.x - ringW / 2, y: center.y - ringH / 2, width: ringW, height: ringH))
        ringPath.addEllipse(in: CGRect(x: center.x - (ringW * 0.82) / 2, y: center.y - (ringH * 0.72) / 2, width: ringW * 0.82, height: ringH * 0.72))
        path.addPath(ringPath, transform: ringTransform)
        
        return path
    }
}

// MARK: - 18. Astronaut Helmet Shape
public struct AstronautShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Outer Helmet Dome
        path.addRoundedRect(in: CGRect(x: w * 0.18, y: h * 0.12, width: w * 0.64, height: h * 0.62), cornerSize: CGSize(width: w * 0.28, height: h * 0.28))
        
        // Reflective Visor Oval
        path.addRoundedRect(in: CGRect(x: w * 0.26, y: h * 0.22, width: w * 0.48, height: h * 0.36), cornerSize: CGSize(width: w * 0.18, height: h * 0.16))
        
        // Visor Glare Reflection Arc
        path.move(to: CGPoint(x: w * 0.34, y: h * 0.28))
        path.addQuadCurve(to: CGPoint(x: w * 0.44, y: h * 0.26), control: CGPoint(x: w * 0.38, y: h * 0.25))
        
        // Left Ear Communication Module
        path.addRoundedRect(in: CGRect(x: w * 0.11, y: h * 0.32, width: w * 0.07, height: h * 0.22), cornerSize: CGSize(width: 4, height: 4))
        
        // Right Ear Communication Module
        path.addRoundedRect(in: CGRect(x: w * 0.82, y: h * 0.32, width: w * 0.07, height: h * 0.22), cornerSize: CGSize(width: 4, height: 4))
        
        // Neck Ring Collar Base
        path.move(to: CGPoint(x: w * 0.25, y: h * 0.74))
        path.addLine(to: CGPoint(x: w * 0.20, y: h * 0.88))
        path.addLine(to: CGPoint(x: w * 0.80, y: h * 0.88))
        path.addLine(to: CGPoint(x: w * 0.75, y: h * 0.74))
        path.closeSubpath()
        
        return path
    }
}

// MARK: - 19. Panda Bear Shape
public struct PandaShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Head Oval
        path.addEllipse(in: CGRect(x: w * 0.18, y: h * 0.22, width: w * 0.64, height: h * 0.58))
        
        // Left Ear
        path.addEllipse(in: CGRect(x: w * 0.14, y: h * 0.14, width: w * 0.22, height: h * 0.22))
        
        // Right Ear
        path.addEllipse(in: CGRect(x: w * 0.64, y: h * 0.14, width: w * 0.22, height: h * 0.22))
        
        // Left Eye Patch
        path.addEllipse(in: CGRect(x: w * 0.28, y: h * 0.38, width: w * 0.16, height: h * 0.20))
        path.addEllipse(in: CGRect(x: w * 0.33, y: h * 0.44, width: w * 0.06, height: h * 0.06))
        
        // Right Eye Patch
        path.addEllipse(in: CGRect(x: w * 0.56, y: h * 0.38, width: w * 0.16, height: h * 0.20))
        path.addEllipse(in: CGRect(x: w * 0.61, y: h * 0.44, width: w * 0.06, height: h * 0.06))
        
        // Nose & Snout
        path.addEllipse(in: CGRect(x: w * 0.45, y: h * 0.56, width: w * 0.10, height: h * 0.07))
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.63))
        path.addLine(to: CGPoint(x: w * 0.50, y: h * 0.67))
        path.addQuadCurve(to: CGPoint(x: w * 0.40, y: h * 0.70), control: CGPoint(x: w * 0.44, y: h * 0.72))
        path.move(to: CGPoint(x: w * 0.50, y: h * 0.67))
        path.addQuadCurve(to: CGPoint(x: w * 0.60, y: h * 0.70), control: CGPoint(x: w * 0.56, y: h * 0.72))
        
        return path
    }
}

// MARK: - 20. Dolphin Shape
public struct DolphinShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Leaping Dolphin Body
        path.move(to: CGPoint(x: w * 0.88, y: h * 0.48))
        path.addQuadCurve(to: CGPoint(x: w * 0.55, y: h * 0.20), control: CGPoint(x: w * 0.75, y: h * 0.25))
        // Dorsal Fin
        path.addQuadCurve(to: CGPoint(x: w * 0.42, y: h * 0.10), control: CGPoint(x: w * 0.48, y: h * 0.12))
        path.addQuadCurve(to: CGPoint(x: w * 0.36, y: h * 0.28), control: CGPoint(x: w * 0.40, y: h * 0.22))
        // Down to Fluke / Tail
        path.addQuadCurve(to: CGPoint(x: w * 0.12, y: h * 0.70), control: CGPoint(x: w * 0.22, y: h * 0.45))
        // Flukes
        path.addLine(to: CGPoint(x: w * 0.05, y: h * 0.64))
        path.addLine(to: CGPoint(x: w * 0.10, y: h * 0.74))
        path.addLine(to: CGPoint(x: w * 0.06, y: h * 0.84))
        path.addLine(to: CGPoint(x: w * 0.16, y: h * 0.76))
        // Belly & Underbody
        path.addQuadCurve(to: CGPoint(x: w * 0.45, y: h * 0.58), control: CGPoint(x: w * 0.26, y: h * 0.68))
        // Flipper
        path.addLine(to: CGPoint(x: w * 0.48, y: h * 0.74))
        path.addQuadCurve(to: CGPoint(x: w * 0.56, y: h * 0.56), control: CGPoint(x: w * 0.54, y: h * 0.68))
        path.addQuadCurve(to: CGPoint(x: w * 0.88, y: h * 0.48), control: CGPoint(x: w * 0.76, y: h * 0.54))
        
        // Eye
        path.addEllipse(in: CGRect(x: w * 0.72, y: h * 0.38, width: w * 0.04, height: w * 0.04))
        
        return path
    }
}

// MARK: - 21. Butterfly Shape
public struct ButterflyShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let cx = rect.midX
        
        // Body
        path.addRoundedRect(in: CGRect(x: cx - w * 0.025, y: h * 0.25, width: w * 0.05, height: h * 0.50), cornerSize: CGSize(width: 4, height: 4))
        path.addEllipse(in: CGRect(x: cx - w * 0.035, y: h * 0.18, width: w * 0.07, height: h * 0.08))
        
        // Antennae
        path.move(to: CGPoint(x: cx, y: h * 0.20))
        path.addQuadCurve(to: CGPoint(x: cx - w * 0.16, y: h * 0.08), control: CGPoint(x: cx - w * 0.08, y: h * 0.10))
        path.move(to: CGPoint(x: cx, y: h * 0.20))
        path.addQuadCurve(to: CGPoint(x: cx + w * 0.16, y: h * 0.08), control: CGPoint(x: cx + w * 0.08, y: h * 0.10))
        
        // Left Upper Wing
        path.move(to: CGPoint(x: cx - w * 0.025, y: h * 0.32))
        path.addCurve(to: CGPoint(x: cx - w * 0.44, y: h * 0.18), control1: CGPoint(x: cx - w * 0.15, y: h * 0.10), control2: CGPoint(x: cx - w * 0.35, y: h * 0.08))
        path.addQuadCurve(to: CGPoint(x: cx - w * 0.025, y: h * 0.52), control: CGPoint(x: cx - w * 0.38, y: h * 0.44))
        
        // Left Lower Wing
        path.move(to: CGPoint(x: cx - w * 0.025, y: h * 0.52))
        path.addCurve(to: CGPoint(x: cx - w * 0.34, y: h * 0.74), control1: CGPoint(x: cx - w * 0.28, y: h * 0.56), control2: CGPoint(x: cx - w * 0.36, y: h * 0.66))
        path.addQuadCurve(to: CGPoint(x: cx - w * 0.025, y: h * 0.72), control: CGPoint(x: cx - w * 0.18, y: h * 0.82))
        
        // Right Upper Wing
        path.move(to: CGPoint(x: cx + w * 0.025, y: h * 0.32))
        path.addCurve(to: CGPoint(x: cx + w * 0.44, y: h * 0.18), control1: CGPoint(x: cx + w * 0.15, y: h * 0.10), control2: CGPoint(x: cx + w * 0.35, y: h * 0.08))
        path.addQuadCurve(to: CGPoint(x: cx + w * 0.025, y: h * 0.52), control: CGPoint(x: cx + w * 0.38, y: h * 0.44))
        
        // Right Lower Wing
        path.move(to: CGPoint(x: cx + w * 0.025, y: h * 0.52))
        path.addCurve(to: CGPoint(x: cx + w * 0.34, y: h * 0.74), control1: CGPoint(x: cx + w * 0.28, y: h * 0.56), control2: CGPoint(x: cx + w * 0.36, y: h * 0.66))
        path.addQuadCurve(to: CGPoint(x: cx + w * 0.025, y: h * 0.72), control: CGPoint(x: cx + w * 0.18, y: h * 0.82))
        
        return path
    }
}

// MARK: - 22. Bonsai Tree Shape
public struct BonsaiShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Pot Planter
        path.move(to: CGPoint(x: w * 0.24, y: h * 0.82))
        path.addLine(to: CGPoint(x: w * 0.76, y: h * 0.82))
        path.addLine(to: CGPoint(x: w * 0.70, y: h * 0.92))
        path.addLine(to: CGPoint(x: w * 0.30, y: h * 0.92))
        path.closeSubpath()
        
        // Trunk
        path.move(to: CGPoint(x: w * 0.46, y: h * 0.82))
        path.addQuadCurve(to: CGPoint(x: w * 0.40, y: h * 0.55), control: CGPoint(x: w * 0.38, y: h * 0.70))
        path.addQuadCurve(to: CGPoint(x: w * 0.26, y: h * 0.48), control: CGPoint(x: w * 0.32, y: h * 0.52))
        path.move(to: CGPoint(x: w * 0.40, y: h * 0.55))
        path.addQuadCurve(to: CGPoint(x: w * 0.62, y: h * 0.42), control: CGPoint(x: w * 0.48, y: h * 0.48))
        path.move(to: CGPoint(x: w * 0.54, y: h * 0.82))
        path.addQuadCurve(to: CGPoint(x: w * 0.46, y: h * 0.55), control: CGPoint(x: w * 0.46, y: h * 0.70))
        
        // Foliage Clouds
        path.addEllipse(in: CGRect(x: w * 0.14, y: h * 0.38, width: w * 0.26, height: h * 0.15))
        path.addEllipse(in: CGRect(x: w * 0.52, y: h * 0.32, width: w * 0.32, height: h * 0.17))
        path.addEllipse(in: CGRect(x: w * 0.30, y: h * 0.16, width: w * 0.36, height: h * 0.18))
        
        return path
    }
}

// MARK: - 23. Faceted Magic Crystal Shape
public struct CrystalShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        let top = CGPoint(x: w * 0.5, y: h * 0.08)
        let upperL = CGPoint(x: w * 0.22, y: h * 0.32)
        let upperR = CGPoint(x: w * 0.78, y: h * 0.32)
        let lowerL = CGPoint(x: w * 0.26, y: h * 0.72)
        let lowerR = CGPoint(x: w * 0.74, y: h * 0.72)
        let bottom = CGPoint(x: w * 0.5, y: h * 0.92)
        
        path.move(to: top)
        path.addLine(to: upperR)
        path.addLine(to: lowerR)
        path.addLine(to: bottom)
        path.addLine(to: lowerL)
        path.addLine(to: upperL)
        path.closeSubpath()
        
        let midL = CGPoint(x: w * 0.40, y: h * 0.32)
        let midR = CGPoint(x: w * 0.60, y: h * 0.32)
        let midLowL = CGPoint(x: w * 0.42, y: h * 0.72)
        let midLowR = CGPoint(x: w * 0.58, y: h * 0.72)
        
        path.move(to: top); path.addLine(to: midL); path.addLine(to: midLowL); path.addLine(to: bottom)
        path.move(to: top); path.addLine(to: midR); path.addLine(to: midLowR); path.addLine(to: bottom)
        path.move(to: upperL); path.addLine(to: midL); path.addLine(to: midR); path.addLine(to: upperR)
        path.move(to: lowerL); path.addLine(to: midLowL); path.addLine(to: midLowR); path.addLine(to: lowerR)
        
        return path
    }
}

// MARK: - 24. Sailboat Shape
public struct SailboatShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        // Boat Hull
        path.move(to: CGPoint(x: w * 0.12, y: h * 0.70))
        path.addLine(to: CGPoint(x: w * 0.88, y: h * 0.70))
        path.addQuadCurve(to: CGPoint(x: w * 0.74, y: h * 0.86), control: CGPoint(x: w * 0.82, y: h * 0.84))
        path.addLine(to: CGPoint(x: w * 0.24, y: h * 0.86))
        path.addQuadCurve(to: CGPoint(x: w * 0.12, y: h * 0.70), control: CGPoint(x: w * 0.16, y: h * 0.82))
        path.closeSubpath()
        
        // Mast
        path.move(to: CGPoint(x: w * 0.48, y: h * 0.68))
        path.addLine(to: CGPoint(x: w * 0.48, y: h * 0.12))
        
        // Main Sail
        path.move(to: CGPoint(x: w * 0.45, y: h * 0.16))
        path.addLine(to: CGPoint(x: w * 0.18, y: h * 0.62))
        path.addLine(to: CGPoint(x: w * 0.45, y: h * 0.62))
        path.closeSubpath()
        
        // Jib Sail
        path.move(to: CGPoint(x: w * 0.51, y: h * 0.20))
        path.addLine(to: CGPoint(x: w * 0.78, y: h * 0.62))
        path.addLine(to: CGPoint(x: w * 0.51, y: h * 0.62))
        path.closeSubpath()
        
        // Waterline
        path.move(to: CGPoint(x: w * 0.08, y: h * 0.92))
        path.addQuadCurve(to: CGPoint(x: w * 0.92, y: h * 0.92), control: CGPoint(x: w * 0.50, y: h * 0.96))
        
        return path
    }
}

// MARK: - 25. Airplane Shape
public struct AirplaneShape: Shape {
    public init() {}
    
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let cx = rect.midX
        
        // Fuselage & Wings
        path.move(to: CGPoint(x: cx, y: h * 0.08))
        path.addQuadCurve(to: CGPoint(x: cx + w * 0.06, y: h * 0.40), control: CGPoint(x: cx + w * 0.08, y: h * 0.20))
        path.addLine(to: CGPoint(x: w * 0.92, y: h * 0.54))
        path.addLine(to: CGPoint(x: w * 0.90, y: h * 0.62))
        path.addLine(to: CGPoint(x: cx + w * 0.06, y: h * 0.56))
        path.addLine(to: CGPoint(x: cx + w * 0.04, y: h * 0.82))
        path.addLine(to: CGPoint(x: cx + w * 0.24, y: h * 0.90))
        path.addLine(to: CGPoint(x: cx + w * 0.22, y: h * 0.94))
        path.addLine(to: CGPoint(x: cx, y: h * 0.92))
        path.addLine(to: CGPoint(x: cx - w * 0.22, y: h * 0.94))
        path.addLine(to: CGPoint(x: cx - w * 0.24, y: h * 0.90))
        path.addLine(to: CGPoint(x: cx - w * 0.04, y: h * 0.82))
        path.addLine(to: CGPoint(x: cx - w * 0.06, y: h * 0.56))
        path.addLine(to: CGPoint(x: w * 0.10, y: h * 0.62))
        path.addLine(to: CGPoint(x: w * 0.08, y: h * 0.54))
        path.addLine(to: CGPoint(x: cx - w * 0.06, y: h * 0.40))
        path.addQuadCurve(to: CGPoint(x: cx, y: h * 0.08), control: CGPoint(x: cx - w * 0.08, y: h * 0.20))
        path.closeSubpath()
        
        path.addArc(center: CGPoint(x: cx, y: h * 0.22), radius: w * 0.04, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: false)
        
        return path
    }
}

// MARK: - Generic Vector Renderer
public typealias VectorShapeView = VectorRendererView

public struct VectorRendererView: View {
    public let shapeType: VectorShapeType
    public var strokeColor: Color = Color.cyan
    public var lineWidth: CGFloat = 3.5
    
    public init(shapeType: VectorShapeType, strokeColor: Color = Color.cyan, lineWidth: CGFloat = 3.5) {
        self.shapeType = shapeType
        self.strokeColor = strokeColor
        self.lineWidth = lineWidth
    }
    
    public var body: some View {
        Group {
            let strokeStyle = StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round)
            switch shapeType {
            case .star:
                StarShape().stroke(strokeColor, style: strokeStyle)
            case .cat:
                CatShape().stroke(strokeColor, style: strokeStyle)
            case .heart:
                HeartShape().stroke(strokeColor, style: strokeStyle)
            case .flower:
                FlowerShape().stroke(strokeColor, style: strokeStyle)
            case .car:
                CarShape().stroke(strokeColor, style: strokeStyle)
            case .lion:
                LionShape().stroke(strokeColor, style: strokeStyle)
            case .bird:
                BirdShape().stroke(strokeColor, style: strokeStyle)
            case .strawberry:
                StrawberryShape().stroke(strokeColor, style: strokeStyle)
            case .orange:
                OrangeShape().stroke(strokeColor, style: strokeStyle)
            case .watermelon:
                WatermelonShape().stroke(strokeColor, style: strokeStyle)
            case .apple:
                AppleShape().stroke(strokeColor, style: strokeStyle)
            case .marshmallow:
                MarshmallowShape().stroke(strokeColor, style: strokeStyle)
            case .mnms:
                MnMShape().stroke(strokeColor, style: strokeStyle)
            case .lollipop:
                LollipopShape().stroke(strokeColor, style: strokeStyle)
            case .candy:
                WrappedCandyShape().stroke(strokeColor, style: strokeStyle)
            case .rocket:
                RocketShape().stroke(strokeColor, style: strokeStyle)
            case .planet:
                PlanetShape().stroke(strokeColor, style: strokeStyle)
            case .astronaut:
                AstronautShape().stroke(strokeColor, style: strokeStyle)
            case .panda:
                PandaShape().stroke(strokeColor, style: strokeStyle)
            case .dolphin:
                DolphinShape().stroke(strokeColor, style: strokeStyle)
            case .butterfly:
                ButterflyShape().stroke(strokeColor, style: strokeStyle)
            case .bonsai:
                BonsaiShape().stroke(strokeColor, style: strokeStyle)
            case .crystal:
                CrystalShape().stroke(strokeColor, style: strokeStyle)
            case .sailboat:
                SailboatShape().stroke(strokeColor, style: strokeStyle)
            case .airplane:
                AirplaneShape().stroke(strokeColor, style: strokeStyle)
            @unknown default:
                StarShape().stroke(strokeColor, style: strokeStyle)
            }
        }
    }
}
